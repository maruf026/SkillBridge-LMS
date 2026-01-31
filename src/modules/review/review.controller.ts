import type { Request, Response } from "express";
import { reviewServices } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { tutorId, rating, comment } = req.body;

    if (!tutorId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Tutor id, rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await reviewServices.createReview({
      studentId: user.id,
      tutorId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};


export const reviewController = {
    createReview,
}