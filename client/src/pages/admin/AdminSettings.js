import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { settingsAPI, contactAPI } from '../../services/api';
import { FaSave } from 'react-icons/fa';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    homeVideoUrl: '',
    gymHistory: '',
    contactInfo: {
      whatsapp: '',
      email: '',
      address: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getAdmin();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsAPI.update(settings);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await contactAPI.update(settings.contactInfo);
      alert('Contact information updated successfully!');
    } catch (error) {
      console.error('Failed to update contact info:', error);
      alert('Failed to update contact information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="ml-64 flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Website Settings</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* General Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Page Video URL
                  </label>
                  <input
                    type="url"
                    value={settings.homeVideoUrl}
                    onChange={(e) => setSettings({...settings, homeVideoUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/video.mp4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use default hero section
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gym History/About Text
                  </label>
                  <textarea
                    value={settings.gymHistory}
                    onChange={(e) => setSettings({...settings, gymHistory: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter the boxing club's history and about information..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                >
                  <FaSave className="mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={settings.contactInfo.whatsapp}
                    onChange={(e) => setSettings({
                      ...settings, 
                      contactInfo: {...settings.contactInfo, whatsapp: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.contactInfo.email}
                    onChange={(e) => setSettings({
                      ...settings, 
                      contactInfo: {...settings.contactInfo, email: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="info@dubeboxing.co.za"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={settings.contactInfo.address}
                    onChange={(e) => setSettings({
                      ...settings, 
                      contactInfo: {...settings.contactInfo, address: e.target.value}
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Mahalefele road, johannesburg, south africa 1801"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                >
                  <FaSave className="mr-2" />
                  {saving ? 'Saving...' : 'Save Contact Info'}
                </button>
              </form>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Instructions</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• <strong>Video URL:</strong> Add a direct link to an MP4 video file for the home page hero section</li>
              <li>• <strong>Boxing Club History:</strong> This text will appear on the gallery page and home page</li>
              <li>• <strong>WhatsApp:</strong> Include country code (e.g., +1 for US, +44 for UK)</li>
              <li>• <strong>Email:</strong> This will be used for contact forms and display</li>
              <li>• <strong>Address:</strong> Will be displayed on the contact page and footer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 