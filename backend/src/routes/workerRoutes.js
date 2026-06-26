import { Router } from 'express';
import { listWorkers, getWorkerProfile } from '../controllers/workerController.js';

const router = Router();

router.get('/', listWorkers);
router.get('/:id', getWorkerProfile);

export default router;
