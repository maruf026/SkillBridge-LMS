import express from 'express';
import cors from 'cors'




const app = express();
app.use(cors({
   origin: process.env.APP_URL || "http://localhost:3000",
   credentials: true
}));






app.use(express.json());


// app.use("/posts", postRouter)
app.get("/", (req, res)=>{
    res.send('SkillBridge server is running successfully');
})
export default app;