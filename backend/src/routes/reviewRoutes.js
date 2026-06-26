import { Router } from 'express';
import { createReview, getReviewsByUser } from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createReviewValidation } from '../validators/reviewValidators.js';

const router = Router();

router.post('/', authenticate, createReviewValidation, validate, createReview);
router.get('/user/:userId', getReviewsByUser);

export default router;
