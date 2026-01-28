import type { Request, Response } from "express";
import { tutorServices } from "./tutor.service";

const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { bio, subjects, hourlyRate, availability } = req.body;
    const result = await tutorServices.createTutorProfile({
      userId: user.id,
      bio,
      subjects,
      hourlyRate,
      availability,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create tutor profile",
    });
  }
};

export const tutorController = {
  createTutorProfile,
};
