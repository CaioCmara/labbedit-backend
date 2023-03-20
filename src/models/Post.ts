import { PostDB, PostModel } from "../types";

export class Post {
  constructor(
    private id: string,
    private creator_id: string,
    private creator_name: string,
    private content: string,
    private comments_count: number,
    private likes: number,
    private dislikes: number,
    private created_at: string,
    private updated_at: string,
    
  ) {}

  public toDBModel(): PostDB {
    return {
      id: this.id,
      creator_id: this.creator_id,
      content: this.content,
      comments_count: this.comments_count,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  public toBusinessModel(): PostModel {
    return {
      id: this.id,
      content: this.content,
      comments_count: this.comments_count,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.created_at,
      updated_at: this.updated_at,
      creator: {
        id: this.creator_id,
        name: this.creator_name,
      }
     };
  }
  public getId(): string {
    return this.id;
  }

  public setId(value: string): void {
    this.id = value;
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(value: string): void {
    this.content = value;
  }
  public getComments(): number {
    return this.comments_count
}

public setComments(value: number): void {
    this.comments_count = value
}

public addComments(): void {
    this.comments_count += 1
}

public removeComments(): void {
    this.comments_count -= 1
}

  public getLikes(): number {
    return this.likes;
  }

  public setLikes(value: number): void {
    this.likes = value;
  }

  public addLike() {
    this.likes += 1;
  }

  public removeLike() {
    this.likes -= 1;
  }

  public addDislike() {
    this.dislikes += 1;
  }

  public removeDislike() {
    this.dislikes -= 1;
  }

  public getDislikes(): number {
    return this.dislikes;
  }

  public setDislikes(value: number): void {
    this.dislikes = value;
  }

  public getCreatedAt(): string {
    return this.created_at;
  }

  public setCreateAt(value: string): void {
    this.created_at = value;
  }

  public getUpdatedAt(): string {
    return this.updated_at;
  }

  public setUpdatedAt(value: string): void {
    this.updated_at = value;
  }

  public getCreatorId(): string {
    return this.creator_id;
  }

  public setCreatorId(value: string): void {
    this.creator_id = value;
  }

  public getCreatorName(): string {
    return this.creator_name;
  }

  public setCreatorName(value: string): void {
    this.creator_name = value;
  }

 
}
