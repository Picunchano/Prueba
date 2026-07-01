import { Router } from 'express';
import { getProfile, updateProfile, updateWorkerProfile, updateEmployerProfile, uploadAvatar } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/profile/worker', authenticate, updateWorkerProfile);
router.put('/profile/employer', authenticate, updateEmployerProfile);
router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

export default router;