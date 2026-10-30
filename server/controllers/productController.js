const Product = require('../models/Product');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minEcoScore,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = {};

    // Text search on name, description, tags
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // EcoScore filter (e.g., 80+)
    if (minEcoScore) {
      query.ecoScore = { $gte: Number(minEcoScore) };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // Default: newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { averageRating: -1 };
    else if (sort === 'ecoscore') sortOptions = { ecoScore: -1 };
    else if (sort === 'popular') sortOptions = { numReviews: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Check if valid ObjectId or slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get EcoSphere Picks (computed dynamically from database)
// @route   GET /api/products/picks
// @access  Public
const getEcoSpherePicks = async (req, res, next) => {
  try {
    const [bestEcoScore, mostReusable, betterHome, consciousTravel] = await Promise.all([
      // 1. Highest EcoScore overall
      Product.findOne().sort({ ecoScore: -1, averageRating: -1 }),
      // 2. Best Reusable Essential
      Product.findOne({ category: 'Reusable Essentials' }).sort({ ecoScore: -1 }),
      // 3. Best Sustainable Home
      Product.findOne({ category: 'Sustainable Home' }).sort({ ecoScore: -1 }),
      // 4. Best Travel or Tech
      Product.findOne({ category: { $in: ['Travel', 'Eco Tech Accessories'] } }).sort({ ecoScore: -1 }),
    ]);

    return res.json({
      success: true,
      picks: {
        bestEcoScore,
        mostReusable,
        betterHome,
        consciousTravel,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get greener alternatives for a product
// @route   GET /api/products/:id/alternatives
// @access  Public
const getGreenerAlternatives = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const alternatives = await Product.find({
      _id: { $ne: currentProduct._id },
      category: currentProduct.category,
      ecoScore: { $gte: currentProduct.ecoScore },
    })
      .sort({ ecoScore: -1, averageRating: -1 })
      .limit(3);

    return res.json({
      success: true,
      alternatives,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    return res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.deleteOne({ _id: product._id });
    return res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getEcoSpherePicks,
  getGreenerAlternatives,
  createProduct,
  updateProduct,
  deleteProduct,
};
