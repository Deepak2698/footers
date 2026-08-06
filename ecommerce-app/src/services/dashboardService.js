import api from './api';

export async function getOwnerDashboard() {
  const res = await api.get('/api/dashboard/owner');
  return res.data.data;
}

export async function getStaffDashboard() {
  const res = await api.get('/api/dashboard/staff');
  return res.data.data;
}

export default {
  getOwnerDashboard,
  getStaffDashboard
};
