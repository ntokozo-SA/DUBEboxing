import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { analyticsAPI } from './services/api';

// Public Components
import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Contact from './pages/Contact';
import WhatsAppFloat from './components/public/WhatsAppFloat';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTeam from './pages/admin/AdminTeam';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Protected Route Component
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  // Track page visits
  useEffect(() => {
    const trackPageVisit = async () => {
      const path = window.location.pathname;
      let page = 'home';
      
      if (path.startsWith('/admin')) {
        page = 'admin';
      } else if (path === '/events') {
        page = 'events';
      } else if (path === '/gallery') {
        page = 'gallery';
      } else if (path === '/team') {
        page = 'team';
      } else if (path === '/contact') {
        page = 'contact';
      }
      
      try {
        await analyticsAPI.track(page);
      } catch (error) {
        console.error('Failed to track page visit:', error);
      }
    };

    trackPageVisit();
  }, [window.location.pathname]);

  return (
    <Router>
      <div className="App min-h-screen bg-white">
        <Routes>
          {/* Admin Routes - No Login Required */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/team" element={<AdminTeam />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
