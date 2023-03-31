import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

 
import { userRouter } from "./routes/UserRouter";
import { postRouter } from "./routes/PostRouter";
import { commentRouter } from "./routes/CommentsRouter";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.listen(Number(process.env.PORT), () => {
  console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter)