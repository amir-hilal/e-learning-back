const express = require('express');
const WithdrawalForm = require('../models/WithdrawalForm.Model');
const { verifyToken, isAdmin } = require('../middlewares/auth.Middleware');
const router = express.Router();

// Apply withdrawal form (User)
router.post('/apply', verifyToken, async (req, res) => {
  const { classId, reason } = req.body;
  try {
    // Check if a withdrawal form for the same user and class already exists
    const existingForm = await WithdrawalForm.findOne({ user: req.user.id, class: classId });
    if (existingForm) {
      return res.status(400).json({ status: 'error', message: 'Withdrawal form already submitted for this class' });
    }

    const form = new WithdrawalForm({ user: req.user.id, class: classId, reason });
    await form.save();
    res.status(201).json({ status: 'success', message: 'Withdrawal form submitted', data: form });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error submitting withdrawal form' });
  }
});

// Approve/reject withdrawal form (Admin only)
router.put('/approve/:id', verifyToken, isAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const form = await WithdrawalForm.findById(req.params.id);
    form.status = status;
    await form.save();
    res.status(200).json({ status: 'success', message: 'Withdrawal form updated', data: form });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error updating withdrawal form' });
  }
});

module.exports = router;
