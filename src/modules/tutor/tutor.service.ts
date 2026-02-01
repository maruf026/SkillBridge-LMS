
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
  });

  // fetch names for each tutor
  const tutorsWithName = await Promise.all(
    tutors.map(async (tutor) => {
      const user = await prisma.user.findUnique({
        where: { id: tutor.userId },
        select: { name: true },
      });

      return {
        ...tutor,
        name: user?.name,
      };
    }),
  );

  return tutorsWithName;
};

const getSingleTutor = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
  });

  if (!tutor) return null;

  const user = await prisma.user.findUnique({
    where: { id: tutor.userId },
    select: {
      name: true,
    },
  });

  return {
    ...tutor,
    name: user?.name,
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
