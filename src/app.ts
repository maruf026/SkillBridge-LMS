import express from 'express';
import cors from 'cors'

import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

import { authRouter } from './modules/auth/auth.route';
import { tutorRouter } from './modules/tutor/tutor.route';
import { bookingRouter } from './modules/booking/booking.route';
import { reviewRouter } from './modules/review/review.routes';
import { adminRouter } from './modules/admin/admin.routes';


const app = express();

// app.use(cors({
//    origin: process.env.APP_URL || "http://localhost:3000",
//    credentials: true
// }));


const allowedOrigins = [
  "http://localhost:3000",
  "https://skill-bridge-frontend-gules.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);


app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tutors", tutorRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);
// app.all("/api/auth/*spat", toNodeHandler(auth));
app.all('/api/auth/{*any}', toNodeHandler(auth));






app.get("/", (req, res)=>{
    res.send('SkillBridge server is running successfully');
})
export default app;