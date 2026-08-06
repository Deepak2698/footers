import api from './api';

// params: { page, limit, search, category, brand, size, minPrice, maxPrice, sort }
export async function getProducts(params = {}) {
  const res = await api.get('/products', { params });
  return res.data; // { success, data, pagination }
}

export async function getProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data; // { success, data }
}

export async function createProduct(formData) {
  const res = await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function updateProduct(id, formData) {
  const res = await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}

const productService = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

export default productService;
