import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { analyticsAPI } from './services/api';
import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';
import WhatsAppFloat from './components/public/WhatsAppFloat';
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Contact from './pages/Contact';
import AdminDisabled from './pages/admin/AdminDisabled';
import './App.css';

function getPageName(pathname) {
  if (pathname === '/') return 'home';
  const segment = pathname.split('/').filter(Boolean)[0];
  return segment || 'home';
}

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    analyticsAPI.track(getPageName(location.pathname));
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <PageTracker />
      <div className="App">
        <Routes>
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
          <Route path="/admin/*" element={<AdminDisabled />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
