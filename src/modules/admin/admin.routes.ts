import { Router } from "express";
import auth, { UserRole } from "../../middleweres/auth";
import { adminController } from "./admin.controller";

const router = Router();


router.get(
  "/users",
  auth(UserRole.ADMIN),
  adminController.getAllUsers
);

router.patch(
  "/users/:id/ban",
  auth(UserRole.ADMIN),
  adminController.banOrUnbanUser
);


router.get(
  "/bookings",
  auth(UserRole.ADMIN),
  adminController.getAllBookings
);


// category management
router.post(
  "/categories",
  auth(UserRole.ADMIN),
  adminController.createCategory
);

router.get(
  "/categories",
  auth(UserRole.ADMIN),
  adminController.getAllCategories
);

router.delete(
  "/categories/:id",
  auth(UserRole.ADMIN),
  adminController.deleteCategory
);

export const adminRouter = router;