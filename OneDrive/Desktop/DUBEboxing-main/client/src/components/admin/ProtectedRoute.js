import React from 'react';

const ProtectedRoute = ({ children }) => {
  // Bypass authentication - allow direct access
  return children;
};

export default ProtectedRoute; 