const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { seedDatabase } = require('../seed/seedData');

let mongoServer;
let customerToken;
let adminToken;
let testProductId;
let customerId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await seedDatabase();

  // Login as demo customer to get token
  const customerRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'demo@ecosphere.dev', password: 'EcoDemo123!' });
  customerToken = customerRes.body.token;
  customerId = customerRes.body.user.id;

  // Login as demo admin to get token
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@ecosphere.dev', password: 'EcoAdmin123!' });
  adminToken = adminRes.body.token;

  // Grab a product ID for testing
  const product = await Product.findOne();
  testProductId = product._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('EcoSphere Backend API Tests', () => {
  // 1. Health check
  test('GET /api/health should return status healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.database).toBe('connected');
  });

  // 2. Authentication & JWT
  test('POST /api/auth/register should create user, hash password, and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'SecurePassword123!',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('priya@example.com');

    // Verify in DB that password is NOT plaintext
    const dbUser = await User.findOne({ email: 'priya@example.com' }).select('+password');
    expect(dbUser.password).not.toBe('SecurePassword123!');
    expect(dbUser.password.startsWith('$2')).toBe(true); // bcrypt hash
  });

  test('GET /api/auth/me should return authenticated user details', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('demo@ecosphere.dev');
    expect(res.body.user.ecoJourneyStage).toBeDefined();
  });

  test('GET /api/auth/me without token should return 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // 3. Products & EcoScore Filtering
  test('GET /api/products should return list of products from database', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.total).toBeGreaterThanOrEqual(20);
  });

  test('GET /api/products with minEcoScore=80 should filter products accordingly', async () => {
    const res = await request(app).get('/api/products?minEcoScore=80');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    res.body.products.forEach((p) => {
      expect(p.ecoScore).toBeGreaterThanOrEqual(80);
    });
  });

  test('GET /api/products/picks should compute EcoSphere Picks', async () => {
    const res = await request(app).get('/api/products/picks');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.picks.bestEcoScore).toBeDefined();
    expect(res.body.picks.mostReusable).toBeDefined();
  });

  // 4. Order Flow, Stock Validation & Security
  test('POST /api/orders should validate stock and create order in MongoDB', async () => {
    const product = await Product.findById(testProductId);
    const initialStock = product.stock;

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderItems: [
          {
            product: testProductId,
            quantity: 2,
          },
        ],
        shippingAddress: {
          fullName: 'Aarav Patel',
          phone: '+91 98765 43210',
          address: '123 Eco Way',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
        },
        paymentMethod: 'COD',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.orderItems[0].price).toBe(product.price); // Verified price

    // Verify atomic stock deduction
    const updatedProduct = await Product.findById(testProductId);
    expect(updatedProduct.stock).toBe(initialStock - 2);
  });

  test('POST /api/orders should reject order if requested quantity exceeds stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderItems: [
          {
            product: testProductId,
            quantity: 99999, // Exceeds available stock
          },
        ],
        shippingAddress: {
          fullName: 'Aarav Patel',
          phone: '+91 98765 43210',
          address: '123 Eco Way',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
        },
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Insufficient stock/i);
  });

  // 5. Order Authorization Isolation (User A cannot view User B's order)
  test('GET /api/orders/:id should forbid unauthorized user access', async () => {
    // Create an order owned by customer A
    const order = await Order.create({
      user: customerId,
      orderItems: [
        {
          product: testProductId,
          name: 'Test Product',
          quantity: 1,
          image: 'https://example.com/img.jpg',
          price: 999,
        },
      ],
      shippingAddress: {
        fullName: 'Aarav Patel',
        phone: '1234567890',
        address: '123 St',
        city: 'City',
        state: 'State',
        postalCode: '12345',
      },
      paymentMethod: 'COD',
      itemsPrice: 999,
      shippingPrice: 0,
      totalPrice: 999,
    });

    // Register user B
    const userBRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Rohan Gupta',
        email: 'rohan@example.com',
        password: 'Password123!',
      });
    const userBToken = userBRes.body.token;

    // User B tries to read user A's order
    const accessRes = await request(app)
      .get(`/api/orders/${order._id}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(accessRes.statusCode).toBe(403);
    expect(accessRes.body.success).toBe(false);
    expect(accessRes.body.message).toMatch(/Forbidden/i);
  });

  // 6. Wishlist
  test('POST and GET /api/wishlist should manage user wishlist', async () => {
    // Add to wishlist
    const addRes = await request(app)
      .post(`/api/wishlist/${testProductId}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(addRes.statusCode).toBe(200);

    // Fetch wishlist
    const getRes = await request(app)
      .get('/api/wishlist')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.wishlist.some((p) => p._id.toString() === testProductId)).toBe(true);
  });

  // 7. Admin Privileges
  test('PUT /api/orders/:id/status should allow admin to update status', async () => {
    const order = await Order.findOne();
    const updateRes = await request(app)
      .put(`/api/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Delivered' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.order.orderStatus).toBe('Delivered');
  });

  test('PUT /api/orders/:id/status should reject non-admin users with 403', async () => {
    const order = await Order.findOne();
    const updateRes = await request(app)
      .put(`/api/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'Delivered' });

    expect(updateRes.statusCode).toBe(403);
  });
});
