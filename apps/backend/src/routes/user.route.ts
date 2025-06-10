import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/middleware';

const router = Router();

router.get('/profile', authenticateToken, getUserProfile);
router.put('/update', authenticateToken, updateUserProfile);

export default router;