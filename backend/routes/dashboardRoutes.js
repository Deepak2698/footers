import express from 'express';
import { ownerDashboard, staffDashboard } from '../controllers/dashboardController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/owner', protect, authorizeRoles('owner'), ownerDashboard);
router.get('/staff', protect, authorizeRoles('staff','owner'), staffDashboard);

export default router;
