import { Request, Response } from "express";
import { prisma } from '@cashbook/db';
import { createSourceDestinationSchema, updateSourceDestinationSchema } from "@cashbook/validation";

export const createSourceDestination = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = createSourceDestinationSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const entity = await prisma.sourceDestinationEntity.create({
      data: {
        ...result.data,
        owner: {
          connect: { id: userId }
        }
      }
    });

    res.status(201).json(entity);
  } catch (error) {
    console.error("Error creating source/destination entity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSourceDestinations = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const entities = await prisma.sourceDestinationEntity.findMany({
      where: {
        ownerId: userId
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(entities);
  } catch (error) {
    console.error("Error fetching source/destination entities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSourceDestination = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const result = updateSourceDestinationSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    // First check if the entity belongs to the user
    const existingEntity = await prisma.sourceDestinationEntity.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingEntity) {
      return res.status(404).json({ message: "Entity not found" });
    }

    const updatedEntity = await prisma.sourceDestinationEntity.update({
      where: { id },
      data: result.data
    });

    res.json(updatedEntity);
  } catch (error) {
    console.error("Error updating source/destination entity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
