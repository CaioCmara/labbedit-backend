import { CommentDataBase } from "../database/CommentDataBase"
import { CreateCommentInputDTO, DeleteCommentInputDTO, DeleteCommentOutputDTO, GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/CommentDTOS"
import { LikeOrDeslikePostInputDTO } from "../dtos/postDTOS"
 import { PostDatabase } from "../database/PostDataBase"
import { Comment } from "../models/Comments"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { COMMENT_LIKE, CommentDB, CommentWithCreatorDB, LikeDislikeCommentDB } from "../types"
import { UserDatabase } from "../database/UserDatabase"
import { HashManager } from "../services/HashManager"

export class CommentBusiness{
    constructor(
        private commentDatabase: CommentDataBase,
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ){}

    public getComments = async (input: GetCommentsInputDTO) : Promise<GetCommentsOutputDTO> => {
        const {token, id} = input

        if (token === undefined) {
            throw new Error("'token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new Error("'token' inválido")
        }

        const commentsWithCreatorsDB: CommentWithCreatorDB[] = await this.commentDatabase.getComments(id)
        const comments = commentsWithCreatorsDB.map((commentDB) => {
            const comment = new Comment (
                commentDB.id,
                commentDB.creator_name,
                commentDB.creator_id,
                commentDB.content,
                commentDB.likes,
                commentDB.dislikes,
                commentDB.created_at,
                commentDB.updated_at,
                commentDB.post_id,
            )

            return comment.toBusinessModel()
        })

        const output: GetCommentsOutputDTO = comments
        return output
    }

    public createComment = async (input: CreateCommentInputDTO): Promise<CommentDB> => {
        const { token, postId, content } = input

        if (!token) {
            throw new Error("Token não enviado");
        }

        const payload = this.tokenManager.getPayload(token as string)

        if (payload === null) {
            throw new Error("Token inválido");
        }

        const postDB = await this.postDatabase.postWithCreatorById(postId)

        if (!postDB) {
            throw new Error("id informada não encontrada")
        }

        if (!content) {
            throw new Error("'content' obrigatório para criar um comment")
        }

        if (typeof content !== "string") {
            throw new Error("'content' deve ser string")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name

        const comment = new Comment(
            id,
            creatorName,
            creatorId,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            postId
        )

        const commentDB = comment.toDBModel()

        await this.commentDatabase.addComent(commentDB)
        return commentDB
        }
   

    public deleteComment = async (input: DeleteCommentInputDTO): Promise<DeleteCommentOutputDTO> => {
        const {token, idToDelete} = input

        if (token === undefined) {
            throw new Error("token ausente")
        }
        
        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new Error("token inválido")
        }
        
        if (typeof idToDelete !== "string") {
            throw new Error("'idToDelete' deve ser string")
        }

        const commentDB = await this.commentDatabase.findCommentById(idToDelete)
        
 

        if(!commentDB) {
            throw new Error("Comentário não encontrado")
        }

        if (commentDB.creator_id !== payload.id && !["ADMIN"].includes(payload.role)) {
            throw new Error("Somente o criador do comentário pode deletá-lo")
        }

        await this.commentDatabase.deleteComment(idToDelete)

        const output = {
            message: "Comentário deletado com sucesso"
        }

        return output
    }

    public likeOrDislikeComment = async (input: LikeOrDeslikePostInputDTO) => {
        const {likeId, token, like} = input

        if (token === undefined) {
            throw new Error("token ausente")
        }
        
        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new Error("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new Error("'like' deve ser boolean")
        }

        const commentDB = await this.commentDatabase.findCommentById(likeId)

        if (!commentDB) {
            throw new Error("Comentário não encontrado")
        }

        const userId = payload.id;
        const likeValue = like ? 1 : 0;
        const creatorName = payload.name
      

        const likeDislikeDB: LikeDislikeCommentDB = {
            user_id: userId,
            comment_id: likeId,
            has_like: likeValue
        }

        const comment = new Comment(
            commentDB.id,
            commentDB.creator_id,
            creatorName,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.post_id,
        )
 
        const likeDislikeExists = await this.commentDatabase.alreadyLikedOrDisliked(likeDislikeDB)

        switch (likeDislikeExists) {
            case COMMENT_LIKE.ALREADY_LIKED:
              if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB);
                comment.removeLike();
              } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB);
                comment.removeLike();
                comment.addDislike();
              }
              break;
      
            case COMMENT_LIKE.ALREADY_DISLIKED:
              if (like) {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB);
                comment.removeLike();
                comment.addLike();
              } else {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB);
                comment.removeDislike();
              }
              break;
      
            default:
              await this.commentDatabase.likeOrDislike(likeDislikeDB);
              like ? comment.addLike() : comment.addDislike();
              break;
          }
      
          const updateComment = comment.toDBModel();
      
          await this.commentDatabase.updateComment(likeId, updateComment);

        }
}
 
