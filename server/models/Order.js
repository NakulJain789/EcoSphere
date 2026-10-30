const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    ecoScore: {
      type: Number,
      default: 80,
    },
    plasticAvoidedGrams: {
      type: Number,
      default: 0,
    },
    carbonSavedKg: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
      index: true,
    },
    orderItems: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Order items array cannot be empty',
      },
    },
    shippingAddress: {
      fullName: { type: String, required: [true, 'Full name is required'] },
      phone: { type: String, required: [true, 'Phone number is required'] },
      address: { type: String, required: [true, 'Street address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, required: [true, 'State is required'] },
      postalCode: { type: String, required: [true, 'Postal code is required'] },
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['COD', 'CARD_DEMO', 'UPI_DEMO', 'STRIPE', 'RAZORPAY'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered'],
      default: 'Processing',
      index: true,
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    impactSummary: {
      totalPlasticAvoidedGrams: { type: Number, default: 0 },
      totalCarbonSavedKg: { type: Number, default: 0 },
      avgEcoScore: { type: Number, default: 0 },
      reusableItemsCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Order', orderSchema);
