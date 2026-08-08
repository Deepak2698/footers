import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { createShipment, getTrackingStatus } from '../services/shipping/ShippingService.js';
import { sendOrderInvoiceEmail } from '../services/email/emailService.js';
import { generateInvoiceNumber } from '../services/invoice/invoiceService.js';

// Escape regex metacharacters so user-supplied search text can't build an
// expensive/malicious pattern (ReDoS) or an unintended match (e.g. `.*`).
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function generateOrderNumber() {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}

function getGstRate() {
  return parseFloat(process.env.GST_RATE || '0');
}

function getShippingCost(subtotal) {
  const threshold = parseFloat(process.env.FREE_SHIPPING_THRESHOLD || '999');
  const fee = parseFloat(process.env.SHIPPING_FEE || '99');
  return subtotal >= threshold ? 0 : fee;
}

function getCouponDiscount(subtotal, couponCode) {
  if (!couponCode) return 0;
  if (couponCode.toUpperCase() === 'SAVE10') return Math.floor(subtotal * 0.1);
  return 0;
}

async function validateItemsAndReduceStock(items, session) {
  const validatedItems = [];
  let subtotal = 0;

  for (const it of items) {
    const product = await Product.findById(it.productId).session(session);
    if (!product || !product.isActive) throw new Error(`Product not available: ${it.productId}`);

    const qty = Number(it.quantity);
    if (!qty || qty < 1) throw new Error('Invalid quantity');

    const unitPrice = product.discountPrice && product.discountPrice < product.price
      ? product.discountPrice : product.price;

    if (it.size && product.sizes?.length) {
      const sizeObj = product.sizes.find(s => s.size === it.size);
      if (!sizeObj) throw new Error(`Size ${it.size} not available for ${product.title}`);
      if (sizeObj.stock < qty) throw new Error(`Insufficient stock for ${product.title} size ${it.size}`);
      sizeObj.stock -= qty;
    } else {
      if (product.totalStock < qty) throw new Error(`Insufficient stock for ${product.title}`);
      if (product.sizes?.length) {
        throw new Error(`Please select a size for ${product.title}`);
      }
      product.totalStock -= qty;
    }
    await product.save({ session });

    validatedItems.push({
      productId: product._id,
      title: product.title,
      size: it.size || undefined,
      quantity: qty,
      price: unitPrice
    });
    subtotal += unitPrice * qty;
  }

  return { validatedItems, subtotal };
}

async function restoreOrderStock(order, session) {
  for (const it of order.items) {
    const product = await Product.findById(it.productId).session(session);
    if (!product) continue;
    if (it.size && product.sizes?.length) {
      const sizeObj = product.sizes.find(s => s.size === it.size);
      if (sizeObj) sizeObj.stock += it.quantity;
    } else {
      product.totalStock += it.quantity;
    }
    await product.save({ session });
  }
}

async function buildAndSaveOrder(body, session, createdBy) {
  const {
    customerName, customerPhone, customerEmail, shippingAddress,
    orderNotes, paymentMethod, items, couponCode
  } = body;

  if (!customerName || !customerPhone) throw new Error('Customer name and phone are required');
  if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.pincode) {
    throw new Error('Complete shipping address is required');
  }
  if (!items?.length) throw new Error('No items in order');

  const { validatedItems, subtotal } = await validateItemsAndReduceStock(items, session);
  const couponDiscount = getCouponDiscount(subtotal, couponCode);
  const afterCoupon = subtotal - couponDiscount;
  const shippingCost = getShippingCost(afterCoupon);
  const tax = Math.round(afterCoupon * getGstRate() * 100) / 100;
  const total = afterCoupon + shippingCost + tax;

  const orderNumber = generateOrderNumber();
  const order = new Order({
    orderNumber,
    invoiceNumber: generateInvoiceNumber(orderNumber),
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    orderNotes,
    paymentMethod: paymentMethod || 'cod',
    items: validatedItems,
    subtotal,
    discount: couponDiscount,
    couponCode: couponCode || undefined,
    shippingCost,
    tax,
    total,
    status: 'confirmed',
    createdBy: createdBy || undefined
  });

  await order.save({ session });

  const shipment = await createShipment(order);
  order.trackingNumber = shipment.trackingNumber;
  order.trackingStatus = shipment.trackingStatus;
  order.courierPartner = shipment.courierPartner;
  order.shipmentId = shipment.shipmentId;
  order.trackingUrl = shipment.trackingUrl;
  order.status = 'packed';
  await order.save({ session });

  return order;
}

export const checkoutOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await buildAndSaveOrder(req.body, session, null);
    await session.commitTransaction();
    session.endSession();

    sendOrderInvoiceEmail(order).catch(err => console.error('[Email]', err.message));

    res.status(201).json({ success: true, order });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await buildAndSaveOrder(req.body, session, req.user?.id);
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ success: true, order });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });

    const order = await Order.findOne({ orderNumber });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.customerPhone.replace(/\D/g, '') !== String(phone).replace(/\D/g, '')) {
      return res.status(403).json({ success: false, message: 'Phone number does not match' });
    }

    let tracking = null;
    if (order.trackingNumber) {
      tracking = await getTrackingStatus(order.trackingNumber);
    }

    res.json({ success: true, order, tracking });
  } catch (err) { next(err); }
};

export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { orderNumber: { $regex: safeSearch, $options: 'i' } },
        { customerName: { $regex: safeSearch, $options: 'i' } },
        { customerPhone: { $regex: safeSearch, $options: 'i' } }
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const count = await Order.countDocuments(query);
    res.json({ success: true, orders, count });
  } catch (err) { next(err); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId').populate('createdBy', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

export const updateOrderStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).session(session);
    if (!order) throw new Error('Order not found');
    const prevStatus = order.status;
    order.status = status;
    await order.save({ session });

    if (prevStatus !== 'cancelled' && status === 'cancelled') {
      await restoreOrderStock(order, session);
    }

    await session.commitTransaction();
    session.endSession();
    res.json({ success: true, order });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) throw new Error('Order not found');
    if (order.status !== 'cancelled') {
      await restoreOrderStock(order, session);
    }
    await Order.findByIdAndDelete(req.params.id).session(session);
    await session.commitTransaction();
    session.endSession();
    res.json({ success: true });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
