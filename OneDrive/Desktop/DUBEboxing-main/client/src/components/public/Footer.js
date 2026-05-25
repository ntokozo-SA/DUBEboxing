import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { publicAsset } from '../../utils/imageUrl';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <img
              src={publicAsset('/logo.jpg')}
              alt="Dube Boxing Club"
              className="h-16 w-auto mb-4 rounded shadow bg-white p-1"
            />
            <p className="text-gray-300 mb-4">
              Dube Boxing Club — fighting for community wellbeing. Train with expert coaches,
              build skill and fitness, and be part of our Johannesburg boxing family.
            </p>
            <div className="flex space-x-4">
              <span className="text-gray-400" aria-hidden="true"><FaFacebook size={24} /></span>
              <span className="text-gray-400" aria-hidden="true"><FaInstagram size={24} /></span>
              <span className="text-gray-400" aria-hidden="true"><FaTwitter size={24} /></span>
              <span className="text-gray-400" aria-hidden="true"><FaWhatsapp size={24} /></span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-300 hover:text-white transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>Mahalefele road</p>
              <p>johannesburg, south africa 1801</p>
              <p>Phone: +27 76 662 3761</p>
              <p>Email: info@dubeboxing.co.za</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Dube Boxing Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 