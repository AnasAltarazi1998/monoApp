import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPost, Post } from '../post.model';
import { PostService } from '../service/post.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IComment } from 'app/entities/comment/comment.model';
import { CommentService } from 'app/entities/comment/service/comment.service';

@Component({
  selector: 'jhi-post-update',
  templateUrl: './post-update.component.html',
})
export class PostUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  commentsSharedCollection: IComment[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    content: [],
    createdAt: [],
    owner: [],
    comments: [],
    reactions: [],
  });

  constructor(
    protected postService: PostService,
    protected userService: UserService,
    protected commentService: CommentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ post }) => {
      this.updateForm(post);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const post = this.createFromForm();
    if (post.id !== undefined) {
      this.subscribeToSaveResponse(this.postService.update(post));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackCommentById(index: number, item: IComment): number {
    return item.id!;
  }

  getSelectedUser(option: IUser, selectedVals?: IUser[]): IUser {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedComment(option: IComment, selectedVals?: IComment[]): IComment {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(post: IPost): void {
    this.editForm.patchValue({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      owner: post.owner,
      comments: post.comments,
      reactions: post.reactions,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      post.owner,
      ...(post.reactions ?? [])
    );
    this.commentsSharedCollection = this.commentService.addCommentToCollectionIfMissing(
      this.commentsSharedCollection,
      ...(post.comments ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing(
            users,
            this.editForm.get('owner')!.value,
            ...(this.editForm.get('reactions')!.value ?? [])
          )
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.commentService
      .query()
      .pipe(map((res: HttpResponse<IComment[]>) => res.body ?? []))
      .pipe(
        map((comments: IComment[]) =>
          this.commentService.addCommentToCollectionIfMissing(comments, ...(this.editForm.get('comments')!.value ?? []))
        )
      )
      .subscribe((comments: IComment[]) => (this.commentsSharedCollection = comments));
  }

  protected createFromForm(): IPost {
    return {
      ...new Post(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      content: this.editForm.get(['content'])!.value,
      createdAt: this.editForm.get(['createdAt'])!.value,
      owner: this.editForm.get(['owner'])!.value,
      comments: this.editForm.get(['comments'])!.value,
      reactions: this.editForm.get(['reactions'])!.value,
    };
  }
}
