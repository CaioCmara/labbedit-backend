 
import { Request, Response } from "express"

import { CommentBusiness } from "../business/CommentBusiness";
import { CreateCommentInputDTO } from "../dtos/CommentDTOS";
import { BaseError } from "../Error/BaseError";

export class CommentController {
    constructor (
        private commentBusiness: CommentBusiness
    ) {}

    public getComments = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.getComments(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error);
            
            if (error instanceof BaseError) {
                res.send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createComment = async (req: Request, res: Response) => {
        try {
           const input: CreateCommentInputDTO = {
            token: req.headers.authorization,
                postId: req.params.id,
                content: req.body.content
               
           }

           const output = await this.commentBusiness.createComment(input)

           res.status(201).send(output)

        } catch (error) {
            console.log(error)
            
            
            if (error instanceof BaseError) {
                res.send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
 
    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input = {
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.deleteComment(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error);
            
            if (error instanceof BaseError) {
                res.send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeOrDislikeComment = async (req: Request, res: Response) => {
        try {
            const input = {
                likeId: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            const output = await this.commentBusiness.likeOrDislikeComment(input)

            res.status(200).send(output)
            
        } catch (error) {
            console.log(error)
            console.log(error);
            
            if (error instanceof BaseError) {
                res.send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}