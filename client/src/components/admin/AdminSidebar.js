import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaImages, 
  FaUsers, 
  FaCog, 
  FaChartBar,
  FaSignOutAlt 
} from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/events', label: 'Events', icon: FaCalendarAlt },
    { path: '/admin/gallery', label: 'Gallery', icon: FaImages },
    { path: '/admin/team', label: 'Team', icon: FaUsers },
    { path: '/admin/settings', label: 'Settings', icon: FaCog },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          <span className="text-primary-400">GYM</span>
          <span className="text-secondary-400">FLEX</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3" size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-6 left-0 right-0 px-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 rounded-lg"
        >
          <FaSignOutAlt className="mr-3" size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 