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


const getTutorReviews = async (tutorId: string) => {
  return prisma.review.findMany({
    where: { tutorId },
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        select: {
          name: true,
        },
      },
    },
  });
};



export const reviewServices = {
    createReview,
    getTutorReviews
}