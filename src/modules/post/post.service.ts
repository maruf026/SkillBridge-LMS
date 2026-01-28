import { prisma } from "../../lib/prisma";

interface ReviewData {
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string;
}

const createPost = async (payload: ReviewData) => {
  const {studentId, tutorId, rating, comment  } = payload;
  console.log();
  
  const result = await prisma.review.create({
    data: {
      studentId, tutorId, rating, comment 
    },
  });

  return result;
};


export const postService = {
    createPost
}