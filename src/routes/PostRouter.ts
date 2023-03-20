import express from "express";

import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PostBusiness } from "../business/PostBusiness";
import { PostController } from "../controller/PostCotroller";
import { PostDatabase } from "../database/PostDataBase";

export const postRouter = express.Router();

const postController = new PostController(
  new PostBusiness(new PostDatabase(), new IdGenerator(), new TokenManager())
);

//get posts
postRouter.get("/", postController.getPosts)
//new post
postRouter.post("/", postController.createPost)
//edit post
postRouter.put("/:id", postController.editPost)
//delete post by id
postRouter.delete("/:id", postController.deletePost)
//likes e dislikes 
postRouter.put("/:id/like", postController.likeOrDislikePost)