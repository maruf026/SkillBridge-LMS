import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middleweres/auth";

const router = Router();
router.post("/profile",auth(UserRole.TUTOR), tutorController.createTutorProfile)

export const tutorRouter = router;