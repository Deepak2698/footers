import Product from '../models/Product.js';
import Order from '../models/Order.js';

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const ownerDashboard = async (req, res, next) => {
  try {
    const today = startOfToday();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const todaysOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const lowStock = await Product.find({ totalStock: { $lte: 5 } }).limit(10).select('title totalStock');
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
    const inventorySummaryAgg = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: '$totalStock' }, totalSKUs: { $sum: { $size: { $ifNull: ['$sizes', []] } } } } }
    ]);
    const inventorySummary = inventorySummaryAgg[0] || { totalStock: 0, totalSKUs: 0 };
    res.json({ success: true, data: { totalProducts, totalOrders, todaysOrders, totalRevenue, lowStock, recentOrders, inventorySummary } });
  } catch (err) { next(err); }
};

export const staffDashboard = async (req, res, next) => {
  try {
    const today = startOfToday();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const todaysOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const lowStock = await Product.find({ totalStock: { $lte: 5 } }).limit(10).select('title totalStock');
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
    const inventorySummaryAgg = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: '$totalStock' } } }
    ]);
    const inventorySummary = inventorySummaryAgg[0] || { totalStock: 0 };
    res.json({ success: true, data: { totalProducts, totalOrders, todaysOrders, lowStock, recentOrders, inventorySummary } });
  } catch (err) { next(err); }
};
