import express from 'express';
import cors from 'cors'

import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

import { authRouter } from './modules/auth/auth.route';
import { tutorRouter } from './modules/tutor/tutor.route';
import { bookingRouter } from './modules/booking/booking.route';
import { reviewRouter } from './modules/review/review.routes';


const app = express();

app.use(cors({
   origin: process.env.APP_URL || "http://localhost:3000",
   credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tutors", tutorRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.all("/api/auth/*spat", toNodeHandler(auth));






app.get("/", (req, res)=>{
    res.send('SkillBridge server is running successfully');
})
export default app;