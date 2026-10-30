const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getProductReviews,
  createReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Review comment must be between 5 and 1000 characters'),
];

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, validate(reviewValidation), createReview);

module.exports = router;
