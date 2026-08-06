import Product from '../models/Product.js';

function safeParseJSON(field) {
  if (!field) return field;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      // not a JSON string; return as-is
      return field;
    }
  }
  return field;
}

function buildImageUrlsFromFiles(req) {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files || files.length === 0) return [];
  const host = req.get('host');
  const protocol = req.protocol;
  return files.map((f) => `${protocol}://${host}/uploads/products/${f.filename}`);
}

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin/Owner)
export const createProduct = async (req, res) => {
  try {
    // Accept form-data and JSON bodies. Parse fields that may arrive as JSON strings.
    const {
      title,
      slug,
      description,
      shortDescription,
      brand,
      category,
      price,
      discountPrice,
      images: imagesBody,
      sizes: sizesBody,
      colors: colorsBody,
      material,
      isFeatured,
      isActive,
      createdBy
    } = req.body;

    const parsedImages = safeParseJSON(imagesBody) || [];
    const parsedSizes = safeParseJSON(sizesBody) || [];
    const parsedColors = safeParseJSON(colorsBody) || [];

    // Build images list from uploaded files if present (multipart/form-data)
    const uploadedImageUrls = buildImageUrlsFromFiles(req);
    const images = (Array.isArray(parsedImages) ? parsedImages : (parsedImages ? [parsedImages] : [])).concat(uploadedImageUrls);
    const sizes = Array.isArray(parsedSizes) ? parsedSizes : (parsedSizes ? [parsedSizes] : []);
    const colors = Array.isArray(parsedColors) ? parsedColors : (parsedColors ? [parsedColors] : []);

    // Validate required fields
    if (!title || !description || !brand || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, brand, category, and price'
      });
    }

    // Validate images
    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    // Validate sizes
    if (!sizes || sizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one size is required'
      });
    }

    // Validate stock values
    for (const size of sizes) {
      const stockVal = typeof size.stock === 'string' ? parseInt(size.stock, 10) : size.stock;
      if (typeof stockVal !== 'number' || Number.isNaN(stockVal) || stockVal < 0) {
        return res.status(400).json({ success: false, message: 'Stock cannot be negative or non-numeric' });
      }
      // normalize
      size.stock = stockVal;
    }

    // Create product
    // Auto-generate productCode if not provided
    let productCode;
    if (!req.body.productCode) {
      const brandKey = (brand || 'GEN').toUpperCase().replace(/\s+/g, '-');
      const count = await Product.countDocuments({ brand });
      productCode = `FT-${brandKey}-${String(count + 1).padStart(4, '0')}`;
    }

    const product = await Product.create({
      title,
      slug,
      description,
      shortDescription,
      brand,
      category,
      price,
      discountPrice,
      images,
      sizes,
      colors,
      material,
      isFeatured,
      isActive,
      productCode: req.body.productCode || productCode,
      createdBy: createdBy || req.user?.id
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this slug already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true };

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Brand filter
    if (req.query.brand) {
      query.brand = req.query.brand;
    }

    // Size filter
    if (req.query.size) {
      query['sizes.size'] = req.query.size;
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Sorting
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'priceAsc':
          sort = { price: 1 };
          break;
        case 'priceDesc':
          sort = { price: -1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    const response = {
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };

    if (req.query.facets === 'true') {
      const categories = await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      const brands = await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      response.facets = {
        categories: categories.map(c => ({ name: c._id, count: c.count })),
        brands: brands.map(b => ({ name: b._id, count: b.count }))
      };
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Owner)
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }


    // Accept form-data and JSON bodies for update as well
    const {
      title,
      slug,
      description,
      shortDescription,
      brand,
      category,
      price,
      discountPrice,
      images: imagesBody,
      sizes: sizesBody,
      colors: colorsBody,
      material,
      isFeatured,
      isActive
    } = req.body;

    const parsedImages = safeParseJSON(imagesBody) || [];
    const parsedSizes = safeParseJSON(sizesBody) || [];
    const parsedColors = safeParseJSON(colorsBody) || [];

    // start with images provided in body (if any)
    const imagesFromBody = Array.isArray(parsedImages) ? parsedImages : (parsedImages ? [parsedImages] : []);
    // add any uploaded files
    const uploadedImageUrls = buildImageUrlsFromFiles(req);
    const finalImages = imagesFromBody.concat(uploadedImageUrls);

    // sizes from body take precedence if provided
    const sizes = Array.isArray(parsedSizes) ? parsedSizes : (parsedSizes ? [parsedSizes] : undefined);
    const colors = Array.isArray(parsedColors) ? parsedColors : (parsedColors ? [parsedColors] : undefined);

    // Validate stock values if sizes are being updated
    if (sizes) {
      for (const size of sizes) {
        const stockVal = typeof size.stock === 'string' ? parseInt(size.stock, 10) : size.stock;
        if (typeof stockVal !== 'number' || Number.isNaN(stockVal) || stockVal < 0) {
          return res.status(400).json({ success: false, message: 'Stock cannot be negative or non-numeric' });
        }
        size.stock = stockVal;
      }
    }

    // Prepare update payload
    const updatePayload = {
      title,
      slug,
      description,
      shortDescription,
      brand,
      category,
      price,
      discountPrice,
      images: finalImages.length > 0 ? finalImages : undefined,
      sizes: sizes !== undefined ? sizes : undefined,
      colors: colors !== undefined ? colors : undefined,
      material,
      isFeatured,
      isActive,
      productCode: req.body.productCode || undefined
    };

    // Remove undefined fields so findByIdAndUpdate doesn't overwrite with undefined
    Object.keys(updatePayload).forEach((k) => updatePayload[k] === undefined && delete updatePayload[k]);

    // If sizes provided, calculate totalStock so it stays in sync (pre 'save' not triggered by findByIdAndUpdate)
    if (updatePayload.sizes && Array.isArray(updatePayload.sizes)) {
      updatePayload.totalStock = updatePayload.sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
    }

    product = await Product.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this slug already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin/Owner)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
