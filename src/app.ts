import express from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

// Import your routers
import { authRouter } from './modules/auth/auth.route';
import { tutorRouter } from './modules/tutor/tutor.route';
import { bookingRouter } from './modules/booking/booking.route';
import { reviewRouter } from './modules/review/review.routes';
import { adminRouter } from './modules/admin/admin.routes';

const app = express();

// --- 1. CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:3000",
  "https://skill-bridge-frontend-gules.vercel.app",
  process.env.APP_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // Match allowed list or any Vercel preview deployment
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app");

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

// --- 2. MIDDLEWARE ---
app.use(express.json());

// --- 3. AUTHENTICATION (CRITICAL ORDER) ---

/** * We mount your custom authRouter to a DIFFERENT path. 
 * If you keep it at /api/auth, it will block Better-Auth's internal routes.
 */
app.use("/api/auth-custom", authRouter); 

/** * Better-Auth catch-all handler. 
 * Use '*' for Express. This handles /api/auth/sign-in, /get-session, etc.
 */
app.all("/api/auth/*", toNodeHandler(auth));

// --- 4. OTHER ROUTES ---
app.use("/api/tutors", tutorRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send('SkillBridge server is running successfully');
});

export default app;