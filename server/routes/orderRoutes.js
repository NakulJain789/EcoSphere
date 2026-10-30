const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validate');

const orderValidation = [
  body('orderItems').isArray({ min: 1 }).withMessage('At least one item is required in the order'),
  body('orderItems.*.product').notEmpty().withMessage('Product ID is required for each item'),
  body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Delivery address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
];

// User order routes
router.post('/', protect, validate(orderValidation), createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin-only order routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
