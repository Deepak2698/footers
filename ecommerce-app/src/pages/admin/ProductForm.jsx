import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { getProductById } from '../../services/productService';
import { useToast } from '../../components/Toast';

export default function ProductForm() {
  const { showToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id
  });

  const [form, setForm] = useState({
    title: '', brand: '', category: '', description: '', price: '', discountPrice: '', sizes: [{ size: '', stock: 0 }], isFeatured: false, isActive: true, images: [], files: [], productCode: ''
  });

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      setForm({
        title: p.title || '', brand: p.brand || '', category: p.category || '', description: p.description || '', price: p.price || '', discountPrice: p.discountPrice || '', sizes: p.sizes || [{ size: '', stock: 0 }], isFeatured: p.isFeatured || false, isActive: p.isActive !== false, images: p.images || [], productCode: p.productCode || ''
      });
    }
  }, [data]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSizeChange = (index, field, value) => {
    setForm(prev => {
      const sizes = [...prev.sizes];
      sizes[index] = { ...sizes[index], [field]: field === 'stock' ? Number(value) : value };
      return { ...prev, sizes };
    });
  };

  const addSize = () => setForm(prev => ({ ...prev, sizes: [...prev.sizes, { size: '', stock: 0 }] }));
  const removeSize = (i) => setForm(prev => ({ ...prev, sizes: prev.sizes.filter((_, idx) => idx !== i) }));

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setForm(prev => ({ ...prev, files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('brand', form.brand);
      fd.append('category', form.category);
      fd.append('description', form.description);
      fd.append('price', String(form.price));
      if (form.discountPrice) fd.append('discountPrice', String(form.discountPrice));
      fd.append('isFeatured', String(form.isFeatured));
      fd.append('isActive', String(form.isActive));
      // sizes as JSON
      fd.append('sizes', JSON.stringify(form.sizes));
      // attach files
      for (const f of form.files) {
        fd.append('images', f);
      }
      // product code optionally
      if (form.productCode) fd.append('productCode', form.productCode);

      if (id) {
        await api.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      navigate('/admin/products');
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Save failed', 'error');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Product' : 'New Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <div>
          <label className="block text-sm text-black-300">Product Name</label>
          <input value={form.title} onChange={(e) => handleChange('title', e.target.value)} className="input-field w-full" />
        </div>
        <div>
          <label className="block text-sm text-black-300">Brand</label>
          <input value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} className="input-field w-full" />
        </div>
        <div>
          <label className="block text-sm text-black-300">Category</label>
          <input value={form.category} onChange={(e) => handleChange('category', e.target.value)} className="input-field w-full" />
        </div>
        <div>
          <label className="block text-sm text-black-300">Product Code (optional)</label>
          <input value={form.productCode} onChange={(e) => handleChange('productCode', e.target.value)} className="input-field w-full" />
          <small className="text-gray-500">Leave empty to auto-generate</small>
        </div>
        <div>
          <label className="block text-sm text-black-300">Description</label>
          <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="input-field w-full" rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black-300">Price</label>
            <input type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm text-black-300">Discount Price</label>
            <input type="number" value={form.discountPrice} onChange={(e) => handleChange('discountPrice', e.target.value)} className="input-field w-full" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-black-300 mb-2">Sizes & Stock</label>
          <div className="space-y-2">
            {form.sizes.map((s, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input placeholder="Size" value={s.size} onChange={(e) => handleSizeChange(idx, 'size', e.target.value)} className="input-field w-1/3" />
                <input placeholder="Stock" type="number" value={s.stock} onChange={(e) => handleSizeChange(idx, 'stock', e.target.value)} className="input-field w-1/3" />
                <button type="button" onClick={() => removeSize(idx)} className="btn-outline">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addSize} className="btn-primary mt-2">Add Size</button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-black-300">Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFiles} />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => handleChange('isFeatured', e.target.checked)} /> <span>Featured</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" checked={form.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} /> <span>Active</span></label>
        </div>

        <div>
          <button className="btn-primary" type="submit">Save Product</button>
        </div>
      </form>
    </div>
  );
}
