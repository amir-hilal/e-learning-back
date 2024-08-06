const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Class = require('../models/Class.Model');
const { verifyToken, isAdmin } = require('../middlewares/auth.Middleware');
const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload file and associate with class (Admin)
router.post('/upload/:classId', verifyToken, isAdmin, upload.single('file'), async (req, res) => {
  try {
    const classId = req.params.classId;
    const filePath = req.file.originalname;

    // Find class and update files array
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $push: { files: filePath } },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ status: 'fail', message: 'Class not found' });
    }

    res.status(201).json({ message: 'File uploaded and associated with class', data: updatedClass });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
});

// Delete file and remove from class (Admin)
router.delete('/delete/:classId/:filename', verifyToken, isAdmin, async (req, res) => {
  const classId = req.params.classId;
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  fs.unlink(filePath, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting file', error: err.message });
    }

    // Find class and update files array
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $pull: { files: filename } },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ status: 'fail', message: 'Class not found' });
    }

    res.status(200).json({ message: 'File deleted and removed from class', data: updatedClass });
  });
});

// View files (Public)
router.get('/view/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  console.log('Fetching file from:', filePath); // Add logging to debug
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

module.exports = router;
