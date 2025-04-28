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

const upload = multer({ 
  storage,
  fileFilter:(req,file,cb)=>{
    const allowedType = ['image/jpeg','image/png']

    if(allowedType.includes(file.mimetype)){
      cb(null,true) // Accept file
    }else{
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  }
});


// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    return res.status(400).json({
      success: false,
      error: err.message || 'File upload error',
    });
  } else if (err.message && err.message.includes('Invalid file type')) {
    // Handle file type validation error
    return res.status(400).json({
      success: false,
      error: 'Invalid file type. Only JPEG and PNG are allowed.',
    });
  } else if (err) {
    // Handle other general errors
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
  next();
};

export default upload;
export {handleMulterError};
