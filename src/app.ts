import express from 'express';
import cors from 'cors'

import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import { postRouter } from './modules/post/post.routes';
import { authRouter } from './modules/auth/auth.route';
import { tutorRouter } from './modules/tutor/tutor.route';


const app = express();

app.use(cors({
   origin: process.env.APP_URL || "http://localhost:3000",
   credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tutors", tutorRouter);
app.all("/api/auth/*spat", toNodeHandler(auth));






app.use("/posts", postRouter)
app.get("/", (req, res)=>{
    res.send('SkillBridge server is running successfully');
})
export default app;