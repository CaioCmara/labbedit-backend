import { Request, Response } from "express";
import {
  CreatePostInputDTO,
  DeletePostInputDTO,
  EditPostInputDTO,
  GetPostsInputDTO,
  LikeOrDeslikePostInputDTO,
} from "../dtos/postDTOS";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../Error/BaseError";

export class PostController {
  constructor(private postBusiness: PostBusiness) {}

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input: GetPostsInputDTO = {
        token: req.headers.authorization,
      };

      const output = await this.postBusiness.getPosts(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public createPost = async (req: Request, res: Response) => {
    try {
      const input: CreatePostInputDTO = {
        token: req.headers.authorization,
        content: req.body.content,
      };

      await this.postBusiness.createPost(input);

      res.status(201).end("Post Criado");
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public editPost = async (req: Request, res: Response) => {
    try {
      const input: EditPostInputDTO = {
        token: req.headers.authorization,
        content: req.body.content,
        idToEdit: req.params.id,
      };

      await this.postBusiness.editPost(input);


      res.status(201).end("Post editado com sucesso");
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input: DeletePostInputDTO = {
        token: req.headers.authorization,
        idToDelete: req.params.id,
      };

      await this.postBusiness.deletePost(input);

      res.status(200).end("Post deletado com sucesso");
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input: LikeOrDeslikePostInputDTO = {
        token: req.headers.authorization,
        like: req.body.like,
        likeId: req.params.id,
      };

      await this.postBusiness.likeOrDislikePost(input);

      res.status(200).end();
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
