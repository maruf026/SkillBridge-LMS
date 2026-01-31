import { Router } from "express";
import auth, { UserRole } from "../../middleweres/auth";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(UserRole.STUDENT), reviewController.createReview);


export const reviewRouter = router;