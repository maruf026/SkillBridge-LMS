import { prisma } from "../../lib/prisma";

interface CreateReviewInput {
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string;
}

const createReview = async (
  studentId: string,
  tutorUserId: string,
  rating: number,
  comment: string
) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: tutorUserId },
  });

  if (!tutorProfile) return null;

  return prisma.review.create({
    data: {
      studentId,
      tutorId: tutorProfile.id,
      rating,
      comment,
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