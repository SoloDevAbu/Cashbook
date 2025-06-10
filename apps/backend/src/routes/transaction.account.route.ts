import { Router } from 'express';
import { createAccount, getAccounts, updateAccount, updateAccountStatus } from '../controllers/transaction.account';
import { authenticateToken } from '../middlewares/middleware';
import { NextFunction, Request, Response } from 'express';

const router = Router();

// Error handling wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/', authenticateToken, asyncHandler(createAccount));
router.get('/', authenticateToken, asyncHandler(getAccounts));
router.put('/:id', authenticateToken, asyncHandler(updateAccount));
router.patch('/:id/status', authenticateToken, asyncHandler(updateAccountStatus));

export default router;
