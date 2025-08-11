'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import Navbar from '@/app/components/Navbar';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="pt-20 px-6 md:ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm text-gray-500">Users</h2>
            <p className="text-2xl font-bold text-orange-500">1,248</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm text-gray-500">Revenue</h2>
            <p className="text-2xl font-bold text-orange-500">$12,300</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm text-gray-500">New Orders</h2>
            <p className="text-2xl font-bold text-orange-500">98</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;