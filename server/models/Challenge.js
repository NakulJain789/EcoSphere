const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Waste Reduction', 'Energy & Climate', 'Mindful Habits', 'Circular Living'],
      default: 'Waste Reduction',
    },
    points: {
      type: Number,
      default: 50,
      min: 10,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Deep Impact'],
      default: 'Easy',
    },
    tip: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Challenge', challengeSchema);
