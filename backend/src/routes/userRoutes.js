import { Router } from 'express';
import { getProfile, updateProfile, updateWorkerProfile, updateEmployerProfile } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/profile/worker', authenticate, updateWorkerProfile);
router.put('/profile/employer', authenticate, updateEmployerProfile);

export default router;
