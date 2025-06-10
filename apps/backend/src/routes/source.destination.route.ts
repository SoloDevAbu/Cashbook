import { Router } from 'express';
import { createSourceDestination, getSourceDestinations, updateSourceDestination } from '../controllers/source.destination.controller';
import { authenticateToken } from '../middlewares/middleware';
import { NextFunction, Request, Response } from 'express';

const router = Router();

// Error handling wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/', authenticateToken, asyncHandler(createSourceDestination));
router.get('/', authenticateToken, asyncHandler(getSourceDestinations));
router.put('/:id', authenticateToken, asyncHandler(updateSourceDestination));

export default router;
