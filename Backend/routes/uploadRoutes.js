import express from 'express';
import upload from '../config/upload.js'; // path to the multer config

const router = express.Router();

router.post('/public/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  res.status(200).json({
    filename: req.file.filename,
    path: `/static/uploads/${req.file.filename}`,
  });
});

export default router;
