const express = require('express');
const User = require('../models/User.Model');
const { verifyToken, isAdmin } = require('../middlewares/auth.Middleware');
const router = express.Router();

// Get all users with enrollments (Admin) excluding admins
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } })
            .populate({
                path: 'enrollments',
                populate: {
                    path: 'class',
                    model: 'Class'
                }
            })
            .exec();

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching users with enrollments',
            error: err.message
        });
    }
});

// Delete user (Admin) excluding admin users
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin user' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

module.exports = router;
