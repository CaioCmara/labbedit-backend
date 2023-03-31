import {
  PostDB,
  LikesDislikesDB,
  POST_LIKE,
  PostWithCreatorDB,
} from "../../src/types";

import { BaseDatabase } from "../../src/database/BaseDatabase";

export class PostDatabaseMock extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES = "likes_dislikes";
  public getPosts = async (): Promise<PostDB[]> => {
    return [
      {
        id: "p001m",
        creator_id: "id-mock",
        content: "Primeiro post M",
        comments_count: 2,
        likes: 1,
        dislikes: 0,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      {
        id: "p002m",
        creator_id: "id-mock",
        content: "Segundo post M",
        comments_count: 2,
        likes: 1,
        dislikes: 1,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
    ];
  };

  public getPostsWithCreators = async (): Promise<PostWithCreatorDB[]> => {
 
    return  [
      {
        id: "id-mock",
        content: "Testando o meu post",
        comments_count: 2,
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator: {
          id: "creator-id-mock",
          name: "Caio"
        },
        creator_name: "Caio"
      }
    ];
  };

  public findById = async (id: string): Promise<PostDB | undefined> => {
    switch (id) {
      case "p001m":
        return {
          id: "p001m",
          creator_id: "id-mock",
          content: "Primeiro post M",
          comments_count: 2,
          likes: 1,
          dislikes: 0,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        };
      case "p002m":
        return {
          id: "p002m",
          creator_id: "id-mock",
          content: "Segundo post M",
          comments_count: 2,
          likes: 1,
          dislikes: 1,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        };
      default:
        return undefined;
    }
  };

  public likeDislike = async (
    likeDislike: LikesDislikesDB
  ): Promise<void> => {};

  //public likeOrDislike = async (
  //likeDislike: LikesDislikesDB
  //): Promise<void> => {};

  public findLikeDislike = async (
    likeDislikeDBToFind: LikesDislikesDB
  ): Promise<POST_LIKE | null> => {
    return null;
  };

  public removeLikeDislike = async (
    likeDislikeDBToRemove: LikesDislikesDB
  ): Promise<void> => {};

  public updateLikeDislike = async (
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> => {};

  public addPost = async (posDBt: PostDB): Promise<void> => {};
  public updatePost = async (id: string, postDB: PostDB): Promise<void> => {};
  public delete = async (id: string): Promise<void> => {};
  public postWithCreatorById = async (postId: string): Promise<PostWithCreatorDB | undefined> => {
    const postWithCreator = {
      id: postId,
      content: "Testando o meu post",
      comments_count: 2,
      likes: 0,
      dislikes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      creator: {
        id: "creator-id-mock",
        name: "Caio"
      },
      creator_name: "Caio"
    };
  
    return postWithCreator;
  };
}
