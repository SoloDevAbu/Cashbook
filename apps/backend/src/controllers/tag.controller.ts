import { Request, Response } from "express";
import { prisma } from '@cashbook/db';
import { createTagSchema, updateTagSchema } from "@cashbook/validation";

export const createTag = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = createTagSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    const { name, details } = result.data;

    const tag = await prisma.tag.create({
      data: {
        name,
        details,
        owner: {
          connect: { id: userId }
        }
      }
    });

    res.status(201).json(tag);
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTags = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        ownerId: userId
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const result = updateTagSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: result.error.format(),
        message: "Invalid data"
      });
    }

    // First check if the tag belongs to the user
    const existingTag = await prisma.tag.findFirst({
      where: {
        id,
        ownerId: userId
      }
    });

    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: result.data
    });

    res.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
