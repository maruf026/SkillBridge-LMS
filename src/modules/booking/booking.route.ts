import { Router } from "express"
import auth, { UserRole } from "../../middleweres/auth";
import { bookingController } from "./booking.controller";

const router = Router()

router.post("/", auth(UserRole.STUDENT), bookingController.createBooking);
router.get("/student", auth(UserRole.STUDENT), bookingController.getStudentBookings);
router.get("/tutor", auth(UserRole.TUTOR), bookingController.getTutorBookings);
router.patch(
  "/:id/status",
  auth(UserRole.TUTOR),
  bookingController.updateBookingStatus
);


export const bookingRouter = router