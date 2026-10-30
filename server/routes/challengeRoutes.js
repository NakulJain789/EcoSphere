const express = require('express');
const router = express.Router();
const {
  getChallenges,
  completeChallenge,
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getChallenges);
router.post('/:id/complete', protect, completeChallenge);

module.exports = router;
