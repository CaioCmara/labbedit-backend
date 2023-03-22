import { PostDatabase } from "../database/PostDataBase";
import { Post } from "../models/Post";

import {
  PostDB,
  LikesDislikesDB,
  POST_LIKE,
  PostWithCreatorDB,
  USER_ROLES,
} from "../types";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {
  CreatePostInputDTO,
  DeletePostInputDTO,
  EditPostInputDTO,
  GetPostsInputDTO,
  GetPostsOutputDTO,
  LikeOrDeslikePostInputDTO,
} from "../dtos/postDTOS";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}
  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { token } = input;

    if (!token) {
      throw new Error("'token' não informado");
    }

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new Error("'token' invalido");
    }

    const postsWithCreatorsDB: PostWithCreatorDB[] =
      await this.postDatabase.getPostsWithCreators();

    const posts = postsWithCreatorsDB.map((postsWithCreatorDB) => {
      const post = new Post(
        postsWithCreatorDB.id,
        postsWithCreatorDB.creator?.id,
        postsWithCreatorDB.creator_name,
        postsWithCreatorDB.content,
        postsWithCreatorDB.comments_count,
        postsWithCreatorDB.likes,
        postsWithCreatorDB.dislikes,
        postsWithCreatorDB.created_at,
        postsWithCreatorDB.updated_at
      );

      return post.toBusinessModel();
    });

    const output: GetPostsOutputDTO = posts;

    return output;
  };

  public createPost = async (input: CreatePostInputDTO): Promise<void> => {
    const { token, content } = input;

    if (!token) {
      throw new Error("'token' não informado");
    }

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new Error("'token' invalido");
    }

    if (typeof content !== "string") {
      throw new Error("'content' deve ser uma string");
    }

    const id = this.idGenerator.generate();
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    const creator_id = payload.id;
    const creatorName = payload.name;

    const post = new Post(
      id,
      creator_id,
      creatorName,
      content,
      0,
      0,
      0,
      created_at,
      updated_at
    );

    const postDB = post.toDBModel();

    await this.postDatabase.addPost(postDB);
  };

  public editPost = async (input: EditPostInputDTO): Promise<void> => {
    const { token, content, idToEdit } = input;

    if (token === undefined) {
      throw new Error("'token' não informado");
    }

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new Error("'token' inválido");
    }

    if (typeof content !== "string") {
      throw new Error("'content' deve ser uma string");
    }

    const postDB = await this.postDatabase.findPostById(idToEdit);

    if (!postDB) {
      throw new Error("'id' não localizado");
    }

    //adms podem editar?

    const creatorId = payload.id;
    const creatorName = payload.name;

    if (postDB.creator_id !== creatorId) {
      throw new Error("Você não tem autorização para editar a publicação.");
    }

    const post = new Post(
      postDB.id,
      postDB.creator_id,
      creatorName,
      postDB.content,
      postDB.comments_count,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at
    );

    post.setContent(content);
    post.setUpdatedAt(new Date().toISOString());

    const updatedPostDB = post.toDBModel();
    await this.postDatabase.updatePost(idToEdit, updatedPostDB);
  };
  public deletePost = async (input: DeletePostInputDTO) => {
    const { token, idToDelete } = input;

    if (!token) {
      throw new Error("'token' não informado");
    }

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new Error("'token' invalido");
    }

    const postDB = await this.postDatabase.findPostById(idToDelete);

    if (!postDB) {
      throw new Error("'id' não encontrado");
    }

    const creatorId = payload.id;

    if (payload.role !== USER_ROLES.ADMIN && postDB.creator_id !== creatorId) {
      throw new Error("Você não possuii autorização para deletar esse post");
    }

    if (postDB) {
      await this.postDatabase.delete(idToDelete);
      const output = {
        message: "Publicação excluida com sucesso",
        post: postDB,
      };
      return output;
    }
  };

  public likeOrDislikePost = async (
    input: LikeOrDeslikePostInputDTO
  ): Promise<void> => {
    const { token, likeId, like } = input;

    if (!token) {
      throw new Error("'token' não informado");
    }

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new Error("'token' invalido");
    }

    if (typeof like !== "boolean") {
      throw new Error("'like' deve ser 1 ou 2");
    }

    const postWithCreatorDB = await this.postDatabase.postWithCreatorById(
      likeId
    );

    if (!postWithCreatorDB) {
      throw new Error("'id' não encontrado");
    }

    const userId = payload.id;
    const likeValue = like ? 1 : 0;

    const likeDislikeDB: LikesDislikesDB = {
      user_id: userId,
      post_id: postWithCreatorDB.id,
      has_like: likeValue,
    };

    const post = new Post(
      postWithCreatorDB.id,
      postWithCreatorDB.creator.id,
      postWithCreatorDB.creator_name,
      postWithCreatorDB.content,
      postWithCreatorDB.comments_count,
      postWithCreatorDB.likes,
      postWithCreatorDB.dislikes,
      postWithCreatorDB.created_at,
      postWithCreatorDB.updated_at
    );

    const likeDislikeExists = await this.postDatabase.alreadyLikedOrDisliked(
      likeDislikeDB
    );

    switch (likeDislikeExists) {
      case POST_LIKE.ALREADY_LIKED:
        if (like) {
          await this.postDatabase.removeLikeDislike(likeDislikeDB);
          post.removeLike();
        } else {
          await this.postDatabase.updateLikeDislike(likeDislikeDB);
          post.removeLike();
          post.addDislike();
        }
        break;

      case POST_LIKE.ALREADY_DISLIKED:
        if (like) {
          await this.postDatabase.updateLikeDislike(likeDislikeDB);
          post.removeLike();
          post.addLike();
        } else {
          await this.postDatabase.removeLikeDislike(likeDislikeDB);
          post.removeDislike();
        }
        break;

      default:
        await this.postDatabase.likeOrDislike(likeDislikeDB);
        like ? post.addLike() : post.addDislike();
        break;
    }

    const updatedPost = post.toDBModel();

    await this.postDatabase.updatePost(likeId, updatedPost);
  };
}
