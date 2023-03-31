import express from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentController } from "../controller/CommentController";
import { CommentDataBase } from "../database/CommentDataBase";
import { PostDatabase } from "../database/PostDataBase";
import { UserDatabase } from "../database/UserDatabase";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export const commentRouter = express.Router();

const commentController = new CommentController(
     new CommentBusiness(
    new CommentDataBase(),
    new PostDatabase(),
    new IdGenerator(),
    new TokenManager(),
  )
);

commentRouter.get("/:id", commentController.getComments);
commentRouter.post("/:id", commentController.createComment);
commentRouter.delete("/:id", commentController.deleteComment);
commentRouter.put("/:id/like", commentController.likeOrDislikeComment);
