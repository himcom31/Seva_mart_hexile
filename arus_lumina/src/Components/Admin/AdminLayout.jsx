import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import CategoryManagement from './Categorymanagement';
import ServiceManagement from './Servicepage';
import AdminBookings from './Adminbookings';
import VendorManagement from './Vendormanagement';
import Customermanagement from './Customermanagement';
import SubServicePage from './SubServicePage'

// Import your pages here as you create them
// import Dashboard from '../../pages/Admin/Dashboard';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">

      {/* Sidebar — always visible inside admin */}
      <Sidebar />

      {/* Main content — flex-1 min-w-0 allows shrinking on mobile, pt-14 offsets sticky mobile top bar */}
      <main className="flex-1 min-w-0 overflow-y-auto pt-14 md:pt-0 p-6">
        <Routes>
          {/* Default: /admin → /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="SubServicePage" element={<SubServicePage />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="customers" element={<Customermanagement />} />
          {/* <Route path="dashboard" element={<Dashboard />} /> */}

          {/* Placeholder until pages are built */}
          <Route path="dashboard" element={
            <div className="flex items-center justify-center h-full text-slate-400 text-xl font-semibold">
              Dashboard coming soon
            </div>
          } />

          <Route path="*" element={
            <div className="flex items-center justify-center h-full text-slate-400 text-xl font-semibold">
              Page not found
            </div>
          } />
        </Routes>
      </main>

    </div>
  );
};

export default AdminLayout;