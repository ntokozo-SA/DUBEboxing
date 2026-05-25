import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaLock } from 'react-icons/fa';

const AdminDisabled = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaLock className="text-gray-500 text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Admin Panel Unavailable</h1>
        <p className="text-gray-600 mb-6">
          Content management, analytics, and other admin features require a backend server,
          which is not connected to this site.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <FaHome className="mr-2" />
          Back to Website
        </Link>
      </div>
    </div>
  );
};

export default AdminDisabled;
