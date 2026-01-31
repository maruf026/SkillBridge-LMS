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


const banOrUnbanUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;

    if (typeof isBanned !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isBanned must be boolean",
      });
    }

    const user = await adminServices.banOrUnbanUser(id as string, isBanned);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};


const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await adminServices.getAllBookings();

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/// category management

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await adminServices.createCategory(name);

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await adminServices.getAllCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await adminServices.deleteCategory(id as string);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};




export const adminController = {
    getAllUsers,
    banOrUnbanUser,
    getAllBookings,
    createCategory,
    getAllCategories,
    deleteCategory
}