import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff', adminCode: '' });
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      await api.post('/auth/register', payload);
      showToast('Registration successful. Please login.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm">Name</label>
              <input className="input-field w-full" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input className="input-field w-full" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Password</label>
              <input className="input-field w-full" type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Role</label>
              <select className="input-field w-full" value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                <option value="staff">Staff</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            {form.role === 'owner' && (
              <div>
                <label className="block text-sm">Owner Admin Code</label>
                <input className="input-field w-full" value={form.adminCode} onChange={(e) => handleChange('adminCode', e.target.value)} />
                <small className="text-gray-500">Enter admin registration code provided by system</small>
              </div>
            )}
            <div>
              <button type="submit" className="btn-primary">Register</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
