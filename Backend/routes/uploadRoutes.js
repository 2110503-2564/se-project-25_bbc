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

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload APIs
 */

/**
 * @swagger
 * /public/upload:
 *   post:
 *     summary: Upload a single file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filename:
 *                   type: string
 *                   description: The name of the uploaded file
 *                 path:
 *                   type: string
 *                   description: URL path to access the uploaded file
 *       400:
 *         description: No file uploaded
 */

export default router;
