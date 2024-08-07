const jwt = require('jsonwebtoken');
const User = require('../models/User.Model');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ status: 'fail', message: 'Access Denied' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ status: 'fail', message: 'Access Denied' });

  try {
    const verified = jwt.decode(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Invalid Token' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ status: 'fail', message: 'Access Denied' });
    next();
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
};

module.exports = { verifyToken, isAdmin };
