import api from './api';

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data; // { success, token, data }
}

export async function profile() {
  const res = await api.get('/auth/profile');
  return res.data;
}

export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}

const authService = { login, profile, logout };

export default authService;
