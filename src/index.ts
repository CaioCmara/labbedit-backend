import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

 
import { userRouter } from "./routes/UserRouter";
import { postRouter } from "./routes/PostRouter";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
