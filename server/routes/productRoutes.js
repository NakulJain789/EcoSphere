const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getProducts,
  getProductById,
  getEcoSpherePicks,
  getGreenerAlternatives,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validate');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

router.get('/', getProducts);
router.get('/picks', getEcoSpherePicks);
router.get('/:id', getProductById);
router.get('/:id/alternatives', getGreenerAlternatives);

// Admin-only routes
router.post('/', protect, adminOnly, validate(productValidation), createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
