import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
  });
};


const banOrUnbanUser = async (id: string, isBanned: boolean) => {
  return prisma.user.update({
    where: { id },
    data: { isBanned },
  });
};


const getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tutor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};



// category management

const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name },
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const deleteCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};


export const adminServices = {
    getAllUsers,
    banOrUnbanUser,
    getAllBookings,
    createCategory,
    getAllCategories,
    deleteCategory
}