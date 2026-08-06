import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { multipleUpload } from '../middleware/uploadMiddleware.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import validateSchema from '../middleware/validateMiddleware.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product with image upload
// @access  Private (Owner/Staff)
router.post('/', protect, authorizeRoles('owner','staff'), multipleUpload('images', 10), validateSchema(createProductSchema), createProduct);

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   PUT /api/products/:id
// @desc    Update product with image upload
// @access  Private (Owner/Staff)
router.put('/:id', protect, authorizeRoles('owner','staff'), multipleUpload('images', 10), validateSchema(updateProductSchema), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Owner)
router.delete('/:id', protect, authorizeRoles('owner'), deleteProduct);

export default router;
