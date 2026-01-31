import { prisma } from "../../lib/prisma";

interface CreateReviewInput {
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string;
}

const createReview = async (data: CreateReviewInput) => {
  return prisma.review.create({
    data: {
      studentId: data.studentId,
      tutorId: data.tutorId,
      rating: data.rating,
      comment: data.comment,
    },
  });
};



export const reviewServices = {
    createReview
}