import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { publicAsset } from '../utils/imageUrl';

/** Hero background — file: client/public/home-video.mp4 */
const HOME_VIDEO = publicAsset('/home-video.mp4');

const Home = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => video.play().catch(() => {});
    video.addEventListener('canplay', play);
    play();

    return () => video.removeEventListener('canplay', play);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={HOME_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={HOME_VIDEO} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 z-[1] bg-black/35"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              Transform Your <span className="text-primary-400">Body</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-lg">
              Join the ultimate boxing experience with expert coaches and a supportive community
            </p>
            <Link
              to="/contact"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Dube Boxing Club</h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto" />
          </div>
          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
            <p className="text-center text-lg">
              Welcome to our boxing club! We are dedicated to helping you build skill, fitness,
              and confidence through quality boxing training in Johannesburg.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Dube Boxing Club?</h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Boxing Training</h3>
              <p className="text-gray-600">
                Structured sessions for beginners and experienced boxers focused on technique, fitness, and discipline.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Coaches</h3>
              <p className="text-gray-600">
                Experienced trainers who support your goals safely and help you grow in and out of the ring.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
              <p className="text-gray-600">
                A welcoming club culture built around wellbeing, respect, and pride in our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <img
              src={publicAsset('/IMG-20250624-WA0003.jpg')}
              alt="Dube Boxing Club"
              className="max-h-80 rounded-lg shadow-lg border-4 border-white bg-white mx-auto"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
