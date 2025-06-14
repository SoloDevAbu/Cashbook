import { Router } from 'express';
import multer from 'multer';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  updateTransactionStatus,
  uploadTransactionReceipts
} from '../controllers/transaction.controller';
import { authenticateToken } from '../middlewares/middleware';
import { NextFunction, Request, Response } from 'express';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/', authenticateToken, asyncHandler(createTransaction));
router.get('/', authenticateToken, asyncHandler(getTransactions));
router.put('/:id', authenticateToken, asyncHandler(updateTransaction));
router.patch('/:id/status', authenticateToken, asyncHandler(updateTransactionStatus));
router.post('/:id/upload', authenticateToken, upload.array('receipts', 10), asyncHandler(uploadTransactionReceipts));

export default router;
