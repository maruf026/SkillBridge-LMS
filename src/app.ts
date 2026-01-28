import express from 'express';
import cors from 'cors'

import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import { postRouter } from './modules/post/post.routes';


const app = express();
app.use(cors({
   origin: process.env.APP_URL || "http://localhost:3000",
   credentials: true
}));


app.all("/api/auth/*spat", toNodeHandler(auth));



app.use(express.json());

app.use("/posts", postRouter)
app.get("/", (req, res)=>{
    res.send('SkillBridge server is running successfully');
})
export default app;