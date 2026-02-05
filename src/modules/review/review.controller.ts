import type { Request, Response } from "express";
import { reviewServices } from "./review.service";
import { prisma } from "../../lib/prisma";

const createReview = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { tutorId, rating, comment } = req.body;

    if (!tutorId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: tutorId },
    });

    if (!tutorProfile) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    const review = await prisma.review.create({
      data: {
        studentId: user.id,
        tutorId: tutorProfile.id, // ✅ CORRECT ID
        rating: Number(rating),
        comment,
      },
    });

    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    console.error("REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};


const getTutorReviews = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: "Tutor id is required",
      });
    }

    const reviews = await reviewServices.getTutorReviews(tutorId as string);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};


export const reviewController = {
    createReview,
    getTutorReviews
}