import { Router } from "express";
import auth, { UserRole } from "../../middleweres/auth";
import { adminController } from "./admin.controller";

const router = Router();


router.get(
  "/users",
  auth(UserRole.ADMIN),
  adminController.getAllUsers
);

export const adminRouter = router;