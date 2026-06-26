import { Router } from 'express';
import { listJobs, getJob, createJob, updateJob, deleteJob, getMyJobs } from '../controllers/jobController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';
import { validate } from '../middlewares/validate.js';
import { createJobValidation, updateJobValidation } from '../validators/jobValidators.js';

const router = Router();

router.get('/', listJobs);
router.get('/my', authenticate, authorize('EMPLOYER'), getMyJobs);
router.get('/:id', getJob);
router.post('/', authenticate, authorize('EMPLOYER'), createJobValidation, validate, createJob);
router.put('/:id', authenticate, authorize('EMPLOYER'), updateJobValidation, validate, updateJob);
router.delete('/:id', authenticate, authorize('EMPLOYER'), deleteJob);

export default router;
