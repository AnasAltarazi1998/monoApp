import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IPost } from 'app/entities/post/post.model';

export interface IComment {
  id?: number;
  title?: string | null;
  createdAt?: dayjs.Dayjs | null;
  user?: IUser | null;
  posts?: IPost[] | null;
}

export class Comment implements IComment {
  constructor(
    public id?: number,
    public title?: string | null,
    public createdAt?: dayjs.Dayjs | null,
    public user?: IUser | null,
    public posts?: IPost[] | null
  ) {}
}

export function getCommentIdentifier(comment: IComment): number | undefined {
  return comment.id;
}
