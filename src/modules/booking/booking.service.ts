import type { BookingStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface CreateBookingInput {
  studentId: string;
  tutorId: string;
  date: Date;
}

const createBooking = async (data: CreateBookingInput) => {
  return prisma.booking.create({
    data: {
      studentId: data.studentId,
      tutorId: data.tutorId,
      date: data.date,
    },
  });
};


const getStudentBookings = async (studentId: string) => {
  return prisma.booking.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: {
      tutor: { select: { name: true } },
    },
  });
};


const getTutorBookings = async (tutorId: string) => {
  return prisma.booking.findMany({
    where: { tutorId },
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { name: true } },
    },
  });
};


const getSingleBooking = async (bookingId: string, user: any) => {
  return prisma.booking.findFirst({
    where: {
      id: bookingId,
      OR: [
        { studentId: user.id },
        { tutorId: user.id },
      ],
    },
    include: {
      tutor: {
        select: { name: true },
      },
    },
  });
};



const updateBookingStatus = async (
  bookingId: string,
  tutorId: string,
  status: BookingStatus
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.tutorId !== tutorId) {
    return null;
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
};


export const bookingServices = {
    createBooking,
    getStudentBookings,
    getTutorBookings,
    updateBookingStatus,
    getSingleBooking
}