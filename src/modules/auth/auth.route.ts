import { Router } from "express"
import auth from "../../middleweres/auth"



const router = Router()

router.get("/me", auth(), (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  })
})

export const authRouter = router
