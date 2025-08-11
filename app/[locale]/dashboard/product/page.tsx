import React from 'react';
import Sidebar from '@/app/components/Sidebar';
import Navbar from '@/app/components/Navbar';

const Product = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="pt-20 px-6 md:ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800">Product {item}</h2>
              <p className="text-sm text-gray-500 mt-1">This is a description of product {item}.</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Product;
