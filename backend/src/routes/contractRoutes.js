import { Router } from 'express';
import { getMyContracts, createContract, completeContract, cancelContract } from '../controllers/contractController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/role.js';

const router = Router();

router.get('/my', authenticate, getMyContracts);
router.post('/', authenticate, authorize('EMPLOYER'), createContract);
router.put('/:id/complete', authenticate, completeContract);
router.put('/:id/cancel', authenticate, cancelContract);

export default router;
