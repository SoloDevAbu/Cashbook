import { Router } from 'express';
import { createTag, getTags, updateTag } from '../controllers/tag.controller';
import { authenticateToken } from '../middlewares/middleware';
import { NextFunction, Request, Response } from 'express';

const router = Router();

// Error handling wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/', authenticateToken, asyncHandler(createTag));
router.get('/', authenticateToken, asyncHandler(getTags));
router.put('/:id', authenticateToken, asyncHandler(updateTag));

export default router;
