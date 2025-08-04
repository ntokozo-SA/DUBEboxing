const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    console.log('Auth middleware called for:', req.path);
    console.log('Headers:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log('Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    console.error('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    res.status(401).json({ message: 'Token is not valid', details: error.message });
  }
};

module.exports = auth; 