import { PostModel } from "../types"

export interface GetPostsInputDTO {
    token: string | undefined
    q?: string;
}

export type GetPostsOutputDTO = PostModel[]

export interface CreatePostInputDTO {
    token: string | undefined
    content: unknown
}

export interface EditPostInputDTO {
    idToEdit: string,
    token: string | undefined,
    content: unknown
}

export interface DeletePostInputDTO {
    idToDelete: string,
    token: string | undefined,
}

export interface LikeOrDeslikePostInputDTO {
    likeId: string,
    token: string | undefined,
    like: number
}

//não precisa de