import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@cashbook/db";
import { sendResetEmail } from "../utils/mailer";
import { loginSchema, registerSchema } from "@cashbook/validation";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: result.error.format,
      message: "Invalid data",
    });
    return;
  }
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    companyName,
    address,
    state,
    country,
    pin,
    pan,
    gst,
    nationalId,
  } = result.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(409).json({
      message: "User already exists",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      phone,
      companyName,
      address,
      state,
      country,
      pin,
      pan,
      gst,
      nationalId,
    },
  });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(201).json({ success: true });
};

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: result.error.format,
      message: "Invalid data",
    });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({ success: true });
};

export const requestReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(404).json({ message: "Email not found" });
    return;
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });

  await sendResetEmail(email, token);

  res.json({ message: "Reset email sent" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        password: hashedPassword,
      },
    });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token has expired" });
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
