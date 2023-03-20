export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export interface UserDB {
  id: string;
  name: string;
  email: string;
  password: string;
  role: USER_ROLES;
  created_at: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role: USER_ROLES;
  created_at: string;
}

export interface PostDB {
  id: string;
  creator_id: string;
  content: string;
  comments_count: number;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

export interface PostModel {
  id: string;
  content: string;
  comments_count: number;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
  };
 
}
export interface LikesDislikesDB {
  user_id: string;
  post_id: string;
  has_like: number;
}

export enum POST_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKED",
}


export interface PostWithCreatorDB extends PostModel {
  creator_name: string;
}

export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}


export interface CommentDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  post_id: string;
}

export interface CommentModel {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
  };
  post_id: string;
}