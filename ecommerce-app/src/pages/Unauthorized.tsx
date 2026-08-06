import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => (
  <div className="min-h-screen bg-black-900 flex items-center justify-center">
    <div className="p-8 bg-black-800 border border-black-700 rounded-lg text-center">
      <h2 className="text-2xl text-black-100 mb-4">Unauthorized</h2>
      <p className="text-black-400 mb-6">You do not have permission to view this page.</p>
      <Link to="/" className="btn-outline">Return Home</Link>
    </div>
  </div>
);

export default Unauthorized;
