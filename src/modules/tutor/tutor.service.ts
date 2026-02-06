
import { prisma } from "../../lib/prisma";

interface CreateTutorProfileInput {
  userId: string;
  bio: string;
   availability: any;
  categoryId: string;
  hourlyRate: number;
  
}

interface UpdateTutorProfileInput {
  bio?: string | undefined;
  categoryId?: string | undefined;
  hourlyRate?: number | undefined;
  availability?: any | undefined;
}

const createTutorProfile = async (data: CreateTutorProfileInput) => {
  return prisma.tutorProfile.create({
    data: {
      userId: data.userId,
      bio: data.bio,

      categoryId: data.categoryId,
      hourlyRate: data.hourlyRate,
      availability: data.availability,
    },
  });
};

const getAllTutors = async () => {
  const tutors = await prisma.tutorProfile.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  return tutors.map((tutor) => {
    const ratings = tutor.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null;

    return {
      id: tutor.id,
      userId: tutor.userId,
      name: tutor.user.name,
      bio: tutor.bio,
      hourlyRate: tutor.hourlyRate,
      availability: tutor.availability,
      category: tutor.category,
      avgRating,
      totalReviews: ratings.length,
      createdAt: tutor.createdAt,
    };
  });
};


const getSingleTutor = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true },
      },
      category: true,
    },
  });

  if (!tutor) return null;

  return {
    id: tutor.id,                 // ✅ TutorProfile.id
    userId: tutor.userId,         // User.id
    name: tutor.user.name,
    bio: tutor.bio,
    hourlyRate: tutor.hourlyRate,
    availability: tutor.availability,
    category: tutor.category,
  };
};


const updateTutorProfile = async (
  userId: string,
  input: UpdateTutorProfileInput,
) => {
  const data: any = {};

  if (input.bio !== undefined) {
    data.bio = input.bio;
  }

  if (input.categoryId !== undefined) {
    data.categoryId = input.categoryId;
  }

  if (input.hourlyRate !== undefined) {
    data.hourlyRate = input.hourlyRate;
  }

  if (input.availability !== undefined) {
    data.availability = input.availability;
  }

  return prisma.tutorProfile.update({
    where: { userId },
    data,
  });
};

const deleteTutorProfile = async (userId: string) => {
  const existingProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    return null;
  }

  return prisma.tutorProfile.delete({
    where: { userId },
  });
};

export const tutorServices = {
  createTutorProfile,
  getAllTutors,
  getSingleTutor,
  updateTutorProfile,
  deleteTutorProfile,
};
