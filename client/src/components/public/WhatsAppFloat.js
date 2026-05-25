import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { openWhatsApp } from '../../utils/whatsapp';

const WhatsAppFloat = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 left-4 sm:left-6"
      style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
    >
      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="gallery-tap-target bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-full p-4 shadow-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 min-w-[56px] min-h-[56px] flex items-center justify-center"
        title="Chat with us on WhatsApp"
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp size={26} />
      </button>
    </div>
  );
};

export default WhatsAppFloat;
