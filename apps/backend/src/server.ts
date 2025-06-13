import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import accountRoutes from './routes/transaction.account.route';
import headerRoutes from './routes/header.route';
import tagRoutes from './routes/tag.route';
import sourceDestinationRoutes from './routes/source.destination.route';
import transactionRoutes from './routes/transaction.route';
import budgetRoutes from './routes/budget.route';
import { apiLogger } from './middlewares/api-logger.middleware';

const app = express();

const PORT = process.env.PORT || 9902; // Default port for backend
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(cookieParser());

// Add API logger middleware to track all requests
app.use(apiLogger);

const allowedOrigins = isProduction
  ? [process.env.PRODUCTION_WEB_URL, process.env.PRODUCTION_MOBILE_URL].filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:19006'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400
}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/headers', headerRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/entities', sourceDestinationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

interface CustomError extends Error {
  status?: number;
  code?: string;
}

app.use((err: CustomError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Something broke!',
    code: err.code
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});