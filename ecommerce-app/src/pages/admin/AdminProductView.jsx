import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../../services/productService';

export default function AdminProductView() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id
  });
  const p = data?.data;

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading product</div>;
  if (!p) return <div className="p-6">Product not found</div>;

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-start space-x-6">
        <div className="w-1/3">
          <img src={p.images?.[0] || '/assets/VKS_8509.JPG'} alt={p.title} className="w-full object-cover rounded" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{p.title}</h2>
          <div className="text-sm text-gray-500">{p.brand} • {p.category}</div>
          <div className="mt-2">Product Code: <strong>{p.productCode}</strong></div>
          <div className="mt-4">{p.description}</div>
          <div className="mt-4">
            <Link to={`/admin/products/edit/${p._id}`} className="btn-outline mr-2">Edit</Link>
            <Link to="/admin/products" className="btn-primary">Back</Link>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold">Sizes & Stock</h3>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {p.sizes?.map((s, i) => (
            <div key={i} className="p-2 border rounded">
              <div className="font-medium">{s.size}</div>
              <div className="text-sm">Stock: {s.stock}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
