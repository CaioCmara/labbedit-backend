import { CommentModel } from "../types"

export interface GetCommentsInputDTO {
    token: string | undefined, 
    id: string
}

export type GetCommentsOutputDTO = CommentModel[]

export interface CreateCommentInputDTO {
    token: string | undefined,
    postId: string,
    content: unknown
}

export interface DeleteCommentInputDTO {
    idToDelete: string,
    token: string | undefined
}
export interface DeleteCommentOutputDTO {
    message: string
}