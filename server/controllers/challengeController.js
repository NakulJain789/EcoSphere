const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @desc    Get all active eco challenges
// @route   GET /api/challenges
// @access  Public
const getChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ active: true }).sort({ points: 1 });
    return res.json({
      success: true,
      count: challenges.length,
      challenges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete an eco challenge
// @route   POST /api/challenges/:id/complete
// @access  Private
const completeChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }

    const user = await User.findById(req.user._id);

    // Check if already completed
    const alreadyCompleted = user.completedChallenges.some(
      (c) => c.challenge && c.challenge.toString() === id.toString()
    );

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this challenge!',
      });
    }

    user.completedChallenges.push({
      challenge: challenge._id,
      completedAt: new Date(),
    });

    user.ecoPoints += challenge.points;
    await user.save();

    return res.json({
      success: true,
      message: `Challenge completed! You earned ${challenge.points} EcoPoints!`,
      ecoPoints: user.ecoPoints,
      ecoJourneyStage: user.ecoJourneyStage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChallenges,
  completeChallenge,
};
