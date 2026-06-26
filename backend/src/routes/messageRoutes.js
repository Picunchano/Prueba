import { Router } from 'express';
import { sendMessage, getConversation, getContacts } from '../controllers/messageController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, sendMessage);
router.get('/contacts', authenticate, getContacts);
router.get('/conversation/:userId', authenticate, getConversation);

export default router;
