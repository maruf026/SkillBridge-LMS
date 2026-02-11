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


// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
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