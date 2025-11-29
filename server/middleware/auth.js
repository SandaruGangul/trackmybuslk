const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fallbackAuth = require('../data/fallbackAuth');

// Helper function to check if MongoDB is available
const isMongoAvailable = async () => {
  try {
    await User.findOne();
    return true;
  } catch (error) {
    return false;
  }
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const mongoAvailable = await isMongoAvailable();
    
    if (mongoAvailable) {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      req.user = user;
    } else {
      // Use fallback authentication
      const user = fallbackAuth.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      const { password: _, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
