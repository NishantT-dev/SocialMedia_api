import express from "express";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
const app=express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send(" Hello to HomePage");
});
app.use("/api/users",userRouter);
app.use("/api/posts",postRouter)
export default app;