import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with WhatsApp Video */}
      <section className="relative h-screen">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover absolute inset-0 z-0"
          poster="/logo.jpg"
        >
          <source src="/home-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              Transform Your <span className="text-primary-400">Body</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-lg">
              Join the ultimate fitness experience with state-of-the-art equipment and expert trainers
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 transform hover:scale-105 shadow-lg">
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Dube Boxing Club</h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
          </div>
          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
            <p className="text-center text-lg">
              Welcome to our boxing club! We are dedicated to helping you achieve your fitness and boxing goals.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Dube Boxing Club?</h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">State-of-the-Art Equipment</h3>
              <p className="text-gray-600">Access to the latest fitness equipment and technology to maximize your workout potential.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Trainers</h3>
              <p className="text-gray-600">Certified personal trainers dedicated to helping you achieve your fitness goals safely and effectively.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
              <p className="text-gray-600">Work out on your schedule with 24/7 access to our facilities and flexible membership options.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 