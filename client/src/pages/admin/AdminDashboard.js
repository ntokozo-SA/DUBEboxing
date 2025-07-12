import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { analyticsAPI } from '../../services/api';
import { 
  FaCalendarAlt, 
  FaImages, 
  FaUsers, 
  FaEye, 
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    analytics: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsAPI.get(7); // Last 7 days
        setStats(response.data || { totalVisits: 0, analytics: [] });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({ totalVisits: 0, analytics: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Add Event',
      description: 'Create a new event with poster',
      icon: FaCalendarAlt,
      link: '/admin/events',
      color: 'bg-blue-500'
    },
    {
      title: 'Upload Image',
      description: 'Add new gallery image',
      icon: FaImages,
      link: '/admin/gallery',
      color: 'bg-green-500'
    },
    {
      title: 'Add Team Member',
      description: 'Add new team member',
      icon: FaUsers,
      link: '/admin/team',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="ml-64 flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 bg-gray-50 min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaEye className="text-blue-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVisits}</p>
                </div>
              </div>
            </div>

            {(stats.analytics || []).slice(0, 3).map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${
                    index === 0 ? 'bg-green-100' : 
                    index === 1 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <FaEye className={`text-xl ${
                      index === 0 ? 'text-green-600' : 
                      index === 1 ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 capitalize">{item._id} Page</p>
                    <p className="text-2xl font-bold text-gray-900">{item.totalVisits}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-full ${action.color}`}>
                        <Icon className="text-white text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{action.title}</h3>
                    </div>
                    <p className="text-gray-600">{action.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {(stats.analytics || []).slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-600 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{item._id} page visited</p>
                      <p className="text-sm text-gray-600">
                        {item.totalVisits} visits in the last 7 days
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Last: {new Date(item.lastVisited).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 