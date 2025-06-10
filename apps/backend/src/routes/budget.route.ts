import { Router } from 'express';
import {
  createBudget,
  getBudgets,
  updateBudget,
  updateBudgetStatus
} from '../controllers/budget.controller';
import { authenticateToken } from '../middlewares/middleware';
import { NextFunction, Request, Response } from 'express';

const router = Router();

// Error handling wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/', authenticateToken, asyncHandler(createBudget));
router.get('/', authenticateToken, asyncHandler(getBudgets));
router.put('/:id', authenticateToken, asyncHandler(updateBudget));
router.patch('/:id/status', authenticateToken, asyncHandler(updateBudgetStatus));

export default router;
