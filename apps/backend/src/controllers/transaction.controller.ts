import { Request, Response } from "express";
import { prisma, TransactionStatus } from '@cashbook/db';
import {
  createTransactionSchema,
  updateTransactionSchema,
  updateTransactionStatusSchema,
  uploadReceiptSchema
} from "@cashbook/validation";
import { uploadFileToAzure } from "../utils/azure-blob-storage";

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
        receiptUrls: [],
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
    const transactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId
      },
      include: {
        account: true,
        header: true,
        tag: true,
        entity: true,
        budget: true
      },
      orderBy: {
        transactionDate: 'desc'
      }
    });

    res.json(transactions);
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

    // First check if the transaction belongs to the user
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

    // First check if the transaction belongs to the user
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
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const files = result.data.receipts as Express.Multer.File[];

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const blobUrl = await uploadFileToAzure(file.buffer, file.originalname, file.mimetype);
      uploadedUrls.push(blobUrl);
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        receiptUrls: {
          push: uploadedUrls
        }
      }
    });

    res.json({
      message: "Receipts uploaded successfully",
      urls: uploadedUrls,
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error("Error uploading receipts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
