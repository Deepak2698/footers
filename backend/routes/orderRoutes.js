import express from 'express';
import {
  checkoutOrder, createOrder, getOrders, getOrderById,
  updateOrderStatus, deleteOrder, trackOrder
} from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/checkout', checkoutOrder);
router.get('/track/:orderNumber', trackOrder);
router.post('/', protect, authorizeRoles('owner', 'staff'), createOrder);
router.get('/', protect, authorizeRoles('owner', 'staff'), getOrders);
router.get('/:id', protect, authorizeRoles('owner', 'staff'), getOrderById);
router.put('/:id/status', protect, authorizeRoles('owner', 'staff'), updateOrderStatus);
router.delete('/:id', protect, authorizeRoles('owner'), deleteOrder);

export default router;
