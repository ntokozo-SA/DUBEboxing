import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { analyticsAPI } from '../../services/api';
import { FaEye, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    analytics: []
  });
  const [dailyAnalytics, setDailyAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const [analyticsResponse, dailyResponse] = await Promise.all([
        analyticsAPI.get(period),
        analyticsAPI.getDaily(period)
      ]);
      setAnalytics(analyticsResponse.data);
      setDailyAnalytics(dailyResponse.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPageColor = (pageName) => {
    const colors = {
      home: 'bg-blue-500',
      events: 'bg-green-500',
      gallery: 'bg-purple-500',
      team: 'bg-yellow-500',
      contact: 'bg-red-500',
      admin: 'bg-gray-500'
    };
    return colors[pageName] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="ml-64 flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Period:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaEye className="text-blue-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalVisits}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaCalendarAlt className="text-green-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Period</p>
                  <p className="text-2xl font-bold text-gray-900">{period} days</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaChartLine className="text-purple-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pages Tracked</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.analytics.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaEye className="text-yellow-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Daily</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(analytics.totalVisits / period)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Page Analytics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Page Visits</h2>
              <div className="space-y-4">
                {analytics.analytics.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${getPageColor(item._id)} mr-3`}></div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{item._id} Page</p>
                        <p className="text-sm text-gray-600">
                          Last visited: {new Date(item.lastVisited).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{item.totalVisits}</p>
                      <p className="text-sm text-gray-600">visits</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Trends */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Daily Trends</h2>
              <div className="space-y-3">
                {dailyAnalytics.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{item._id.page}</p>
                      <p className="text-sm text-gray-600">{item._id.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{item.visits}</p>
                      <p className="text-sm text-gray-600">visits</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Visit Trends</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FaChartLine className="text-4xl mx-auto mb-4" />
                <p>Chart visualization would be displayed here</p>
                <p className="text-sm">Consider integrating Chart.js or Recharts for better visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 