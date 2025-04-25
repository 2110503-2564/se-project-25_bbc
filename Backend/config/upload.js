import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join('public', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const dateStr = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0]; 
    const ext = path.extname(file.originalname);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const filename = `Slip-${dateStr}-${randomSuffix}${ext}`;    
    cb(null, filename);
  }
});

const upload = multer({ storage });

export default upload;
