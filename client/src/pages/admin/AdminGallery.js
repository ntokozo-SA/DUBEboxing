import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { galleryAPI } from '../../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'gym',
    isActive: true
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await galleryAPI.getAllAdmin();
      setGallery(response.data);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('category', formData.category);
    formDataObj.append('isActive', formData.isActive);

    const fileInput = document.getElementById('imageUrl');
    if (fileInput.files[0]) {
      formDataObj.append('image', fileInput.files[0]);
    }

    try {
      if (editingItem) {
        await galleryAPI.update(editingItem._id, formDataObj);
      } else {
        await galleryAPI.create(formDataObj);
      }
      fetchGallery();
      resetForm();
    } catch (error) {
      console.error('Failed to save gallery item:', error);
      alert('Failed to save gallery item. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await galleryAPI.delete(id);
        fetchGallery();
      } catch (error) {
        console.error('Failed to delete gallery item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'gym', isActive: true });
    setEditingItem(null);
    setShowForm(false);
  };

  const editItem = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      isActive: item.isActive
    });
    setEditingItem(item);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="ml-64 flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Gallery</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Image
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingItem ? 'Edit Image' : 'Add New Image'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="gym">Gym</option>
                      <option value="equipment">Equipment</option>
                      <option value="classes">Classes</option>
                      <option value="facilities">Facilities</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    id="imageUrl"
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required={!editingItem}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                  >
                    {editingItem ? 'Update Image' : 'Upload Image'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gallery.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-semibold capitalize">
                    {item.category}
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => editItem(item)}
                      className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  )}
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGallery; 