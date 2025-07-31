import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';
import WhatsAppFloat from './components/public/WhatsAppFloat';
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Contact from './pages/Contact';

import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTeam from './pages/admin/AdminTeam';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import './App.css';

function App() {
  useEffect(() => {
    // Track page views for analytics
    const trackPageView = () => {
      // You can implement analytics tracking here
      console.log('Page viewed:', window.location.pathname);
    };

    trackPageView();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/events" element={
            <>
              <Navbar />
              <Events />
              <Footer />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/gallery" element={
            <>
              <Navbar />
              <Gallery />
              <Footer />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/team" element={
            <>
              <Navbar />
              <Team />
              <Footer />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <Contact />
              <Footer />
              <WhatsAppFloat />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute>
              <AdminEvents />
            </ProtectedRoute>
          } />
          <Route path="/admin/gallery" element={
            <ProtectedRoute>
              <AdminGallery />
            </ProtectedRoute>
          } />
          <Route path="/admin/team" element={
            <ProtectedRoute>
              <AdminTeam />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute>
              <AdminAnalytics />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
