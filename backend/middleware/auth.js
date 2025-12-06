const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Read users to verify user still exists
    const dataPath = path.join(__dirname, '../data.json');
    const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
    const user = data.users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      userId: decoded.userId,
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can access this resource' });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin, JWT_SECRET };
