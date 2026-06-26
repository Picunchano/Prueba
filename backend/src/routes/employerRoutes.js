import { Router } from 'express';
import { listEmployers, getEmployerProfile } from '../controllers/employerController.js';

const router = Router();

router.get('/', listEmployers);
router.get('/:id', getEmployerProfile);

export default router;
