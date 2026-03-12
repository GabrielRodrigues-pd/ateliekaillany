import express from 'express';
import { googleLogin, getProfile } from '../controllers/authController.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

router.post('/google', googleLogin);
router.get('/profile', authUser, getProfile);

export default router;
