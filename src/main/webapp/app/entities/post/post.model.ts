import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IComment } from 'app/entities/comment/comment.model';

export interface IPost {
  id?: number;
  title?: string | null;
  content?: string | null;
  createdAt?: dayjs.Dayjs | null;
  owner?: IUser | null;
  comments?: IComment[] | null;
  reactions?: IUser[] | null;
}

export class Post implements IPost {
  constructor(
    public id?: number,
    public title?: string | null,
    public content?: string | null,
    public createdAt?: dayjs.Dayjs | null,
    public owner?: IUser | null,
    public comments?: IComment[] | null,
    public reactions?: IUser[] | null
  ) {}
}

export function getPostIdentifier(post: IPost): number | undefined {
  return post.id;
}
