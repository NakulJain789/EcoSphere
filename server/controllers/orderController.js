const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod = 'COD' } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    // 1. Fetch fresh products from database to validate stock and prices server-side
    const validatedItems = [];
    let itemsPrice = 0;
    let totalPlasticAvoided = 0;
    let totalCarbonSaved = 0;
    let totalWeightedScore = 0;
    let totalQty = 0;
    let reusableCount = 0;

    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.product}`,
        });
      }

      // Check stock availability
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} left in stock.`,
        });
      }

      const itemTotal = dbProduct.price * item.quantity;
      itemsPrice += itemTotal;

      const plasticAvoided = (dbProduct.ecoImpact?.plasticAvoidedGrams || 0) * item.quantity;
      const carbonSaved = (dbProduct.ecoImpact?.carbonSavedKg || 0) * item.quantity;

      totalPlasticAvoided += plasticAvoided;
      totalCarbonSaved += carbonSaved;
      totalWeightedScore += dbProduct.ecoScore * item.quantity;
      totalQty += item.quantity;

      if (dbProduct.ecoImpact?.isReusable) {
        reusableCount += item.quantity;
      }

      validatedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        quantity: item.quantity,
        image: dbProduct.images[0] || '',
        price: dbProduct.price, // Server verified price!
        ecoScore: dbProduct.ecoScore,
        plasticAvoidedGrams: plasticAvoided,
        carbonSavedKg: carbonSaved,
      });
    }

    // Free shipping on orders over ₹999 / $50, else ₹99 / $5
    const shippingPrice = itemsPrice >= 999 ? 0 : 99;
    const totalPrice = itemsPrice + shippingPrice;

    const avgEcoScore = totalQty > 0 ? Math.round(totalWeightedScore / totalQty) : 80;

    // 2. Perform atomic stock decrement for all purchased items
    for (const item of validatedItems) {
      await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    }

    // 3. Create the order in MongoDB
    const order = new Order({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Processing',
      itemsPrice,
      shippingPrice,
      totalPrice,
      impactSummary: {
        totalPlasticAvoidedGrams: totalPlasticAvoided,
        totalCarbonSavedKg: Math.round(totalCarbonSaved * 10) / 10,
        avgEcoScore,
        reusableItemsCount: reusableCount,
      },
    });

    const createdOrder = await order.save();

    // 4. Award Eco Points to user (10 points per ₹100 or roughly proportional to eco impact)
    const pointsEarned = Math.round(totalPrice / 10) + Math.round(totalPlasticAvoided / 5);
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { ecoPoints: pointsEarned },
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: createdOrder,
      pointsEarned,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Strict Authorization: User can only access their own order, unless admin
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this order',
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    const updatedOrder = await order.save();

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
