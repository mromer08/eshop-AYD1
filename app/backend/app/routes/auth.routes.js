import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authController.js';
import { upload } from '../middlewares/uploadMiddleware.js';

router.post('/register', upload.single('image'), register);
router.post('/login', login);

export default router;