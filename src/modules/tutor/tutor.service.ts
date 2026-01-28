import { prisma } from "../../lib/prisma"


interface CreateTutorProfileInput {
  userId: string
  bio: string
  subjects: string[]
  hourlyRate: number
  availability: string[]
}

const createTutorProfile = async (
  data: CreateTutorProfileInput
) => {
    const result = await prisma.tutorProfile.create({
        data: {
            userId : data.userId,
            bio : data.bio, 
            subjects : data.subjects as any, 
            hourlyRate : data.hourlyRate, 
            availability: data.availability as any
        }
    });
    return result
}

export const tutorServices = {
    createTutorProfile
}