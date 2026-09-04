const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    token = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secure_ecommerce_secret');
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
    return;
  }

  res.status(403).json({ message: 'Admin access required' });
};

module.exports = { protect, adminOnly };
