const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], required: true },
    enrollments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' }]
});

module.exports = mongoose.model('User', UserSchema);
