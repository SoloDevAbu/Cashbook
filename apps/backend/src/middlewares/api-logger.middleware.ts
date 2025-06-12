import { Request, Response, NextFunction } from 'express';
import { prisma } from '@cashbook/db';

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const oldJson = res.json;
  let responseBody: any;

  res.json = function (body) {
    responseBody = body;
    return oldJson.call(this, body);
  };

  res.on('finish', async () => {
    try {
      const endTime = Date.now();
      const processingTime = endTime - startTime;

      await prisma.apiCallLog.create({
        data: {
          userId: req.user?.id,
          endpoint: req.originalUrl,
          method: req.method,
          requestPayload: req.body || {},
          responsePayload: responseBody || {},
          ipAddress: req.ip || '',
          statusCode: res.statusCode,
          errorMessage: res.statusCode >= 400 ? responseBody?.message : null,
          errorSource: res.statusCode >= 400 ? 'API' : null,
          sessionId: req.cookies?.token,
          processingTime,
        },
      });
    } catch (error) {
      console.error('Error logging API call:', error);
    }
  });

  next();
};
