import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middleweres/auth";

const router = Router();
router.post("/profile",auth(UserRole.TUTOR), tutorController.createTutorProfile);
router.get("/", tutorController.getAllTutors);
router.get("/:id", tutorController.getSingleTutor);
router.put("/profile", auth(UserRole.TUTOR), tutorController.updateTutorProfile);
router.delete("/profile", auth(UserRole.TUTOR), tutorController.deleteTutorProfile)

export const tutorRouter = router;