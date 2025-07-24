import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { contactAPI } from '../../services/api';

const WhatsAppFloat = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('+27 76 662 3761');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get contact info from API
    const getContactInfo = async () => {
      try {
        const response = await contactAPI.get();
        setWhatsappNumber(response.data.whatsapp || '+27 76 662 3761');
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      }
    };

    getContactInfo();

    // Show button after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I would like to know more about your boxing club services.');
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
        title="Chat with us on WhatsApp"
      >
        <FaWhatsapp size={24} />
      </button>
    </div>
  );
};

export default WhatsAppFloat; 