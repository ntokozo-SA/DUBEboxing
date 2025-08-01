import React, { useEffect, useState } from 'react';
import { FaCalendarPlus, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { eventAPI } from '../../services/api'; // adjust this if needed

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await eventAPI.get('/');
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        console.error('Events response is not an array:', res.data);
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventAPI.delete(`/${id}`);
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Events</h1>
          <Link
            to="/admin/events/new"
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaCalendarPlus className="mr-2" />
            Add Event
          </Link>
        </div>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-white p-4 shadow rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
                    <p className="text-sm text-gray-600">{event.date}</p>
                    <p className="text-sm mt-2">{event.description}</p>
                  </div>
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
