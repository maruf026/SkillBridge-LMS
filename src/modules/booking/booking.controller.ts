import type { Request, Response } from "express";
import { BookingStatus } from "../../generated/prisma/enums";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { tutorId, date } = req.body;

    if (!tutorId || !date) {
      return res.status(400).json({
        success: false,
        message: "Tutor id and date are required",
      });
    }

    const booking = await bookingServices.createBooking({
      studentId: user.id,
      tutorId,
      date: new Date(date),
    });

    return res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

const getStudentBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const bookings = await bookingServices.getStudentBookings(user.id);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

const getTutorBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const bookings = await bookingServices.getTutorBookings(user.id);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

const getSingleBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const booking = await bookingServices.getSingleBooking(id as string, user);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};


const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const updated = await bookingServices.updateBookingStatus(
      id as string,
      user.id,
      status,
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

export const bookingController = {
  createBooking,
  getStudentBookings,
  getTutorBookings,
  updateBookingStatus,
  getSingleBooking
};
