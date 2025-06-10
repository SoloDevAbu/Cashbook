import { Router } from 'express';
import { register, login, requestReset, resetPassword } from '../controllers/auth.controller';
import { logout } from '../middlewares/middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/request-reset', requestReset);
router.post('/password-reset', resetPassword);
router.post('/logout', logout);

export default router;