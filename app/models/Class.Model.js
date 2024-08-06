const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  files: [{ type: String }] // Add this line
});

module.exports = mongoose.model('Class', ClassSchema);
