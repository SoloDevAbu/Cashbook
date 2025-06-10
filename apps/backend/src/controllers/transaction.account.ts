import { Request, Response } from "express";
import { prisma, TransactionAccountStatus } from '@cashbook/db';
import { createAccountSchema, updateAccountSchema, updateAccountStatusSchema } from "@cashbook/validation";

export const createAccount = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = createAccountSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const { type, name, accountNumber, details, upiLinks } = result.data;

    const account = await prisma.transactionAccount.create({
      data: {
        type,
        name,
        accountNumber,
        details,
        upiLinks: upiLinks || [],
        status: TransactionAccountStatus.ACTIVE,
        owner: {
          connect: { id: userId }
        }
      }
    });

    res.status(201).json(account);
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAccounts = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const accounts = await prisma.transactionAccount.findMany({
      where: {
        ownerId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  
  try {
    const result = updateAccountSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const { type, name, accountNumber, details, upiLinks } = result.data;
    // First check if the account belongs to the user
    const existingAccount = await prisma.transactionAccount.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const updatedAccount = await prisma.transactionAccount.update({
      where: { id },
      data: {
        type,
        name,
        accountNumber,
        details,
        upiLinks: upiLinks || undefined
      }
    });

    res.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAccountStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const result = updateAccountStatusSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const { status } = result.data;

    // First check if the account belongs to the user
    const existingAccount = await prisma.transactionAccount.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const updatedAccount = await prisma.transactionAccount.update({
      where: { id },
      data: { status }
    });

    res.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};