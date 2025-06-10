import { Router } from 'express';
import { createHeader, getHeaders, updateHeaderStatus } from '../controllers/header.controller';
import { authenticateToken } from '../middlewares/middleware';
import { NextFunction, Request, Response } from 'express';

const router = Router();

// Error handling wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/', authenticateToken, asyncHandler(createHeader));
router.get('/', authenticateToken, asyncHandler(getHeaders));
router.patch('/:id/status', authenticateToken, asyncHandler(updateHeaderStatus));

export default router;
