const express = require('express');
const Enrollment = require('../models/Enrollment.Model');
const { verifyToken } = require('../middlewares/auth.Middleware');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Enroll in class (User)
router.post('/enroll', verifyToken, async (req, res) => {
  const { classId } = req.body;
  try {
    // Check if an enrollment for the same user and class already exists
    const existingEnrollment = await Enrollment.findOne({ user: req.user.id, class: classId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    const enrollment = new Enrollment({ user: req.user.id, class: classId });
    await enrollment.save();
    res.status(201).json({ data: enrollment, message: 'Enrolled in class' });
  } catch (err) {
    res.status(500).json({ message: 'Error enrolling in class' });
  }
});

// Get users enrolled in a specific class
router.get('/class/:classId', verifyToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ class: req.params.classId }).populate('user');
    res.status(200).json({ data: enrollments, message: 'Users fetched successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get enrolled classes of logged-in user
router.get('/my-enrollments', verifyToken, async (req, res) => {
  const token = req.header('Authorization').split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const enrollments = await Enrollment.find({ user: decoded.id }).populate('class');
    console.log(decoded, enrollments)
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enrolled classes' });
  }
});

module.exports = router;
