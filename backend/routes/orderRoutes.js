import express from 'express';
import {
  checkoutOrder, createOrder, getOrders, getOrderById,
  updateOrderStatus, deleteOrder, trackOrder
} from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import validateSchema from '../middleware/validateMiddleware.js';
import { checkoutSchema, updateOrderStatusSchema } from '../validators/orderValidator.js';
import { checkoutLimiter, trackOrderLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/checkout', checkoutLimiter, validateSchema(checkoutSchema), checkoutOrder);
router.get('/track/:orderNumber', trackOrderLimiter, trackOrder);
router.post('/', protect, authorizeRoles('owner', 'staff'), validateSchema(checkoutSchema), createOrder);
router.get('/', protect, authorizeRoles('owner', 'staff'), getOrders);
router.get('/:id', protect, authorizeRoles('owner', 'staff'), getOrderById);
router.put('/:id/status', protect, authorizeRoles('owner', 'staff'), validateSchema(updateOrderStatusSchema), updateOrderStatus);
router.delete('/:id', protect, authorizeRoles('owner'), deleteOrder);

export default router;
