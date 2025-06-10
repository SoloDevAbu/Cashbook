import { Request, Response } from "express";
import { prisma, BudgetStatus } from '@cashbook/db';
import {
  createBudgetSchema,
  updateBudgetSchema,
  updateBudgetStatusSchema
} from "@cashbook/validation";

export const createBudget = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = createBudgetSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const { accountId, headerId, tagId, entityId, ...data } = result.data;

    // Verify that the account belongs to the user
    const account = await prisma.transactionAccount.findFirst({
      where: {
        id: accountId,
        ownerId: userId
      }
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const budgetData: any = {
      ...data,
      status: BudgetStatus.UNDER_PROCESS,
      transactionDate: new Date(data.transactionDate),
      account: { connect: { id: accountId } },
      owner: { connect: { id: userId } }
    };
    if (headerId) {
      budgetData.header = { connect: { id: headerId } };
    }
    if (tagId) {
      budgetData.tag = { connect: { id: tagId } };
    }
    if (entityId) {
      budgetData.entity = { connect: { id: entityId } };
    }

    // Create the budget
    const budget = await prisma.budget.create({
      data: budgetData,
      include: {
        account: true,
        header: true,
        tag: true,
        entity: true,
        transactions: true
      }
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBudgets = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const budgets = await prisma.budget.findMany({
      where: {
        ownerId: userId
      },
      include: {
        account: true,
        header: true,
        tag: true,
        entity: true,
        transactions: true
      },
      orderBy: {
        transactionDate: 'desc'
      }
    });

    res.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const result = updateBudgetSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    // First check if the budget belongs to the user
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const { accountId, headerId, tagId, entityId, transactionDate, ...data } = result.data;

    const updateData: any = {
      ...data,
      ...(transactionDate && { transactionDate: new Date(transactionDate) }),
      ...(accountId && { account: { connect: { id: accountId } } }),
      ...(headerId && { header: { connect: { id: headerId } } }),
      ...(tagId && { tag: { connect: { id: tagId } } }),
      ...(entityId && { entity: { connect: { id: entityId } } })
    };

    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: updateData,
      include: {
        account: true,
        header: true,
        tag: true,
        entity: true,
        transactions: true
      }
    });

    res.json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBudgetStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const result = updateBudgetStatusSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    // First check if the budget belongs to the user
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        status: result.data.status
      },
      include: {
        transactions: true
      }
    });

    res.json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
