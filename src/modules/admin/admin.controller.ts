import type { Request, Response } from "express";
import { adminServices } from "./admin.service";

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await adminServices.getAllUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


export const adminController = {
    getAllUsers,
}