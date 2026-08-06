import api from './api';

export async function getOrders(params = {}) {
  const res = await api.get('/orders', { params });
  return res.data;
}

export async function getOrderById(id) {
  const res = await api.get(`/orders/${id}`);
  return res.data;
}

export async function updateOrderStatus(id, status) {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data;
}

export async function checkoutOrder(payload) {
  const res = await api.post('/orders/checkout', payload);
  return res.data;
}

export async function trackOrder(orderNumber, phone) {
  const res = await api.get(`/orders/track/${orderNumber}`, { params: { phone } });
  return res.data;
}

const orderService = { getOrders, getOrderById, updateOrderStatus, checkoutOrder, trackOrder };
export default orderService;
