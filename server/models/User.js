const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Security: never return password by default
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    ecoPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedChallenges: [
      {
        challenge: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Challenge',
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating Eco Journey tier based on eco points
userSchema.virtual('ecoJourneyStage').get(function () {
  const points = this.ecoPoints || 0;
  if (points >= 600) return 'Earth Keeper';
  if (points >= 300) return 'Grower';
  if (points >= 100) return 'Sprout';
  return 'Seed';
});

// Pre-save password hashing hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
