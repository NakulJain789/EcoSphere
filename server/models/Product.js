const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be positive'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Sustainable Home',
        'Reusable Essentials',
        'Sustainable Fashion',
        'Personal Care',
        'Zero Waste',
        'Upcycled',
        'Travel',
        'Eco Tech Accessories',
      ],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A product must have at least one image',
      },
    },
    ecoScore: {
      type: Number,
      min: 0,
      max: 100,
      index: true,
      default: function () {
        if (this.ecoBreakdown) {
          return (
            (this.ecoBreakdown.material || 0) +
            (this.ecoBreakdown.reusability || 0) +
            (this.ecoBreakdown.packaging || 0) +
            (this.ecoBreakdown.durability || 0) +
            (this.ecoBreakdown.recyclability || 0)
          );
        }
        return 80;
      },
    },
    ecoBreakdown: {
      material: { type: Number, min: 0, max: 25, default: 20 },
      reusability: { type: Number, min: 0, max: 25, default: 20 },
      packaging: { type: Number, min: 0, max: 20, default: 16 },
      durability: { type: Number, min: 0, max: 15, default: 12 },
      recyclability: { type: Number, min: 0, max: 15, default: 12 },
    },
    ecoImpact: {
      plasticAvoidedGrams: { type: Number, default: 0 },
      carbonSavedKg: { type: Number, default: 0 },
      materials: [{ type: String }],
      packagingType: { type: String, default: '100% Plastic-Free Compostable Cardboard' },
      isReusable: { type: Boolean, default: true },
      isRecyclable: { type: Boolean, default: true },
    },
    disposableAlternative: {
      name: { type: String, default: 'Single-use plastic counterpart' },
      annualWasteAvoided: { type: String, default: 'Approx. 120 single-use items per year*' },
      comparisonNote: { type: String, default: 'Eliminates recurring single-use consumption and landfill waste.*' },
    },
    averageRating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Slugify and compute ecoScore before validation
productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (this.ecoBreakdown) {
    this.ecoScore =
      (this.ecoBreakdown.material || 0) +
      (this.ecoBreakdown.reusability || 0) +
      (this.ecoBreakdown.packaging || 0) +
      (this.ecoBreakdown.durability || 0) +
      (this.ecoBreakdown.recyclability || 0);
  }
  next();
});

// Compound indexes for searching and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, ecoScore: -1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
