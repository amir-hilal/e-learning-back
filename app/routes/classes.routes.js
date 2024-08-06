const express = require('express');
const Class = require('../models/Class.Model');
const { verifyToken, isAdmin } = require('../middlewares/auth.Middleware');
const router = express.Router();

// Add class (Admin)
router.post('/add', verifyToken, isAdmin, async (req, res) => {
  const { title, description, instructor, files } = req.body; // Add files here
  try {
    const newClass = new Class({ title, description, instructor, files });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error adding class', error: err.message });
  }
});

// Edit class (Admin)
router.put('/edit/:id', verifyToken, isAdmin, async (req, res) => {
  const { title, description, instructor, files } = req.body; // Add files here
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, { title, description, instructor, files }, { new: true });
    if (!updatedClass) {
      return res.status(404).json({ status: 'fail', message: 'Class not found' });
    }
    res.status(200).json({ status: 'success', message: 'Class updated', data: updatedClass });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error updating class', error: err.message });
  }
});

// Delete class (Admin)
router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error deleting class', error: err.message });
  }
});

// Get all classes (Public)
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching classes', error: err.message });
  }
});

// Get a specific class (Public)
router.get('/:id', async (req, res) => {
  try {
    const classInfo = await Class.findById(req.params.id);
    res.status(200).json(classInfo);
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'Error fetching class' });
  }
});

module.exports = router;
