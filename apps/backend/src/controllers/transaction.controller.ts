import { Request, Response } from "express";
import { prisma, TransactionStatus } from '@cashbook/db';
import {
  createTransactionSchema,
  updateTransactionSchema,
  updateTransactionStatusSchema,
  uploadReceiptSchema
} from "@cashbook/validation";
import { getSignedUrl, uploadFileToAzure } from "../utils/azure-blob-storage";

export const createTransaction = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = createTransactionSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const { accountId, headerId, tagId, entityId, budgetId, status, ...data } = result.data;

    const account = await prisma.transactionAccount.findFirst({
      where: {
        id: accountId,
        ownerId: userId
      }
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const relationFields: Record<string, any> = {
      header: headerId ? { connect: { id: headerId } } : undefined,
      tag: tagId ? { connect: { id: tagId } } : undefined,
      entity: entityId ? { connect: { id: entityId } } : undefined,
      budget: budgetId ? { connect: { id: budgetId } } : undefined
    };

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        status: status || TransactionStatus.PENDING,
        transactionDate: new Date(data.transactionDate),
        account: { connect: { id: accountId } },
        owner: { connect: { id: userId } },
        header: relationFields.header,
        tag: relationFields.tag,
        entity: relationFields.entity,
        budget: relationFields.budget
      },
      include: {
        account: true,
        header: true,
        tag: true,
        entity: true,
        budget: true
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const {
      startDate,
      endDate,
      accountId,
      headerId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const where: any = { ownerId: userId };
    if (startDate) {
      where.transactionDate = { ...where.transactionDate, gte: new Date(startDate as string) };
    }
    if (endDate) {
      where.transactionDate = { ...where.transactionDate, lte: new Date(endDate as string) };
    }
    if (accountId) {
      where.accountId = accountId;
    }
    if (headerId) {
      where.headerId = headerId;
    }
    if (search) {
      where.OR = [
        { details: { contains: search, mode: 'insensitive' } },
        { transferId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const allTransactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
        header: true,
        tag: true,
        entity: true,
        budget: true,
        receipts: true,
      },
      orderBy: {
        [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc',
      },
    });

    const transactionsWithSignedUrls = await Promise.all(
      allTransactions.map(async (transaction) => {
        if (transaction.receipts && transaction.receipts.length > 0) {
          const receiptsWithUrls = await Promise.all(
            transaction.receipts.map(async (receipt) => {
              try {
                const signedUrl = await getSignedUrl(receipt.container, receipt.blobName);
                return {
                  ...receipt,
                  signedUrl
                };
              } catch (error) {
                console.error(`Error generating signed URL for receipt ${receipt.id}:`, error);
                return receipt;
              }
            })
          );
          return {
            ...transaction,
            receipts: receiptsWithUrls
          };
        }
        return transaction;
      })
    );

    const credit = transactionsWithSignedUrls.filter(t => t.type === 'CREDIT');
    const debit = transactionsWithSignedUrls.filter(t => t.type === 'DEBIT');

    res.json({ credit, debit });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const result = updateTransactionSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const { accountId, headerId, tagId, entityId, budgetId, transactionDate, ...data } = result.data;

    const updateData: any = {
      ...data,
      ...(transactionDate && { transactionDate: new Date(transactionDate) }),
      ...(accountId && { account: { connect: { id: accountId } } }),
      ...(headerId && { header: { connect: { id: headerId } } }),
      ...(tagId && { tag: { connect: { id: tagId } } }),
      ...(entityId && { entity: { connect: { id: entityId } } }),
      ...(budgetId && { budget: { connect: { id: budgetId } } })
    };

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        account: true,
        header: true,
        tag: true,
        entity: true,
        budget: true
      }
    });

    res.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTransactionStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const result = updateTransactionStatusSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        status: result.data.status
      }
    });

    res.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadTransactionReceipts = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const result = uploadReceiptSchema.safeParse({
      receipts: req.files
    });
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        ownerId: userId
      },
      include: {
        receipts: true
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const files = result.data.receipts as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    const uploadedReceipts = await Promise.all(
      files.map(async (file) => {
        try {          
          const blobName = await uploadFileToAzure(file.buffer, file.originalname, file.mimetype);
          const container = process.env.AZURE_STORAGE_ACCOUNT!;
          
          const receiptData = {
            blobName,
            container,
            mimeType: file.mimetype,
            size: file.size,
            originalName: file.originalname,
            transaction: {
              connect: { id }
            },
          };
          
          return prisma.transactionReceipt.create({
            data: receiptData
          });
        } catch (error) {
          console.error(`Error uploading file ${file.originalname}:`, error);
          throw new Error(`Failed to upload ${file.originalname}`);
        }
      })
    );

    const updatedTransaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        account: true,
        header: true,
        tag: true,
        entity: true,
        budget: true,
        receipts: true
      }
    });

    if (updatedTransaction?.receipts) {
      const receiptsWithUrls = await Promise.all(
        updatedTransaction.receipts.map(async (receipt) => {
          try {
            const signedUrl = await getSignedUrl(receipt.container, receipt.blobName);
            return {
              ...receipt,
              signedUrl
            };
          } catch (error) {
            console.error(`Error generating signed URL for receipt ${receipt.id}:`, error);
            return receipt;
          }
        })
      );
      updatedTransaction.receipts = receiptsWithUrls;
    }

    res.json({
      message: "Receipts uploaded successfully",
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error("Error uploading receipts:", error);
    res.status(500).json({ 
      message: "Failed to upload receipts",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
