import { Request, Response } from "express";
import { prisma, HeaderStatus } from '@cashbook/db';
import { createHeaderSchema, updateHeaderStatusSchema } from "@cashbook/validation";

export const createHeader = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = createHeaderSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const { name, details, status } = result.data;

    const header = await prisma.header.create({
      data: {
        name,
        details,
        status: status as HeaderStatus,
        owner: {
          connect: { id: userId }
        }
      }
    });

    res.status(201).json(header);
  } catch (error) {
    console.error("Error creating header:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHeaders = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const headers = await prisma.header.findMany({
      where: {
        ownerId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(headers);
  } catch (error) {
    console.error("Error fetching headers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateHeaderStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const result = updateHeaderStatusSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const { status } = result.data;

    // First check if the header belongs to the user
    const existingHeader = await prisma.header.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingHeader) {
      return res.status(404).json({ message: "Header not found" });
    }

    const updatedHeader = await prisma.header.update({
      where: { id },
      data: { status }
    });

    res.json(updatedHeader);
  } catch (error) {
    console.error("Error updating header status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
