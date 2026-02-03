import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middleweres/auth";
import { prisma } from "../../lib/prisma";

const router = Router();
router.post("/profile",auth(UserRole.TUTOR), tutorController.createTutorProfile);
router.get("/", tutorController.getAllTutors);
router.get(
  "/profile/me",
  auth(UserRole.TUTOR),
  async (req, res) => {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  }
);

router.get("/:id", tutorController.getSingleTutor);
router.put("/profile", auth(UserRole.TUTOR), tutorController.updateTutorProfile);
router.delete("/profile", auth(UserRole.TUTOR), tutorController.deleteTutorProfile)

export const tutorRouter = router;