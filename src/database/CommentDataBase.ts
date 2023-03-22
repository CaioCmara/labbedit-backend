import {
  CommentDB,
  CommentWithCreatorDB,
  LikeDislikeCommentDB,
  COMMENT_LIKE,
} from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { PostDatabase } from "./PostDataBase";

export class CommentDataBase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static likes_dislikes_comment = "likesDislikesComments";

  public getComments = async (id: string): Promise<CommentWithCreatorDB[]> => {
    const result: CommentWithCreatorDB[] = await BaseDatabase
    .connection(CommentDataBase.TABLE_COMMENTS)
    .select(
        "comments.id",
        "comments.creator_id",
        "comments.content",
        "comments.likes",
        "comments.dislikes",
        "comments.created_at",
        "comments.post_id",
        "users.name AS creator_name"
    )
    .join("users", "comments.creator_id", "=", "users.id")
    .join("posts", "comments.post_id", "=", "posts.id")
    .where("comments.post_id", id)

    return result
}
  public getCommentsWithCreators = async () => {
    const result: CommentWithCreatorDB = await BaseDatabase.connection(
      CommentDataBase.TABLE_COMMENTS
    )
      .select(
        "comments.id",
        "comments.creator_id",
        "comments.content",
        "comments.likes",
        "comments.dislikes",
        "comments.created_at",
        "comments.updated_at",
        "comments.post_id",
        "users.name AS creator_name"
      )
      .join("users", "comments.creator_id", "=", "users.id");

    return result;
  };

  public addComent = async (newComment: CommentDB) => {
    await BaseDatabase.connection(CommentDataBase.TABLE_COMMENTS).insert(
      newComment
    );
  };

  public findCommentById = async (
    id: string
  ): Promise<CommentDB | undefined> => {
    const result: CommentDB[] = await BaseDatabase.connection(
      CommentDataBase.TABLE_COMMENTS
    )
      .select()
      .where({ id });

    return result[0];
  };

  public updateComment = async (
    id: string,
    newCommentDB: CommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDataBase.TABLE_COMMENTS)
      .update(newCommentDB)
      .where({ id });
  };

  public deleteComment = async (id: string): Promise<void> => {
    await BaseDatabase.connection(CommentDataBase.TABLE_COMMENTS)
      .delete()
      .where({ id });
  };

  public getCommentsByPostId = async (postId: string): Promise<CommentDB[]> => {
    const result: CommentDB[] = await BaseDatabase.connection(
      CommentDataBase.TABLE_COMMENTS
    )
      .select("*")
      .where({ post_id: postId });

    return result;
  };

  public likeOrDislike = async (
    likeDislike: LikeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(
      CommentDataBase.likes_dislikes_comment
    ).insert(likeDislike);
  };
  public alreadyLikedOrDisliked = async (
    likeDislikeDBToFind: LikeDislikeCommentDB
  ): Promise<COMMENT_LIKE | null> => {
    const [LikeDislikeCommentDB]: LikeDislikeCommentDB[] =
      await BaseDatabase.connection(CommentDataBase.likes_dislikes_comment)
        .select()
        .where({
          user_id: likeDislikeDBToFind.user_id,
          post_id: likeDislikeDBToFind.comment_id,
        });
    if (LikeDislikeCommentDB) {
      return LikeDislikeCommentDB.has_like === 1
        ? COMMENT_LIKE.ALREADY_LIKED
        : COMMENT_LIKE.ALREADY_DISLIKED;
    } else {
      return null;
    }
  };

  public removeLikeDislike = async (
    LikeDislikeCommentDB: LikeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDataBase.likes_dislikes_comment)
      .delete()
      .where({
        user_id: LikeDislikeCommentDB.user_id,
        post_id: LikeDislikeCommentDB.comment_id,
      });
  };

  public updateLikeDislike = async (
    LikeDislikeCommentDB: LikeDislikeCommentDB
  ) => {
    await BaseDatabase.connection(CommentDataBase.likes_dislikes_comment)
      .update(LikeDislikeCommentDB)
      .where({
        user_id: LikeDislikeCommentDB.user_id,
        post_id: LikeDislikeCommentDB.comment_id,
      });
  };
}
