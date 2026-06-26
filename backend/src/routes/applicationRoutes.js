import { Router } from 'express';
import {
  applyToJob,
  getMyApplications,
  acceptApplication,
  rejectApplication,
  getApplicationsForMyJobs,
} from '../controllers/applicationController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';

const router = Router();

router.post('/:jobId/apply', authenticate, authorize('WORKER'), applyToJob);
router.get('/my', authenticate, authorize('WORKER'), getMyApplications);
router.get('/employer', authenticate, authorize('EMPLOYER'), getApplicationsForMyJobs);
router.put('/:id/accept', authenticate, authorize('EMPLOYER'), acceptApplication);
router.put('/:id/reject', authenticate, authorize('EMPLOYER'), rejectApplication);

export default router;
