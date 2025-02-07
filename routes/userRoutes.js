import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure the upload directory exists
const uploadPath = 'uploads/';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);

export default router;
