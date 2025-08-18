import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ArticleService } from "../../../shared/services/article.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ArticleType } from "../../../../types/article.type";
import { environment } from "../../../../environments/environment";
import { CommentService } from "../../../shared/services/comment.service";
import { CommentType } from "../../../../types/comment.type";
import { CommentsResponseType } from "../../../../types/comments-response.type";
import { NewCommentType } from "../../../../types/new-comment.type";
import { switchMap } from "rxjs";
import { AuthService } from "../../../core/auth/auth.service";
import { DefaultResponseType } from "../../../../types/default-response.type";
import { UserActionType } from "../../../../types/user-action.type";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {

  serverStaticPath = environment.serverStaticPath;
  isLogged: boolean = false;
  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  userActions: UserActionType[] = [];
  newCommentText: string = '';

  constructor(private authService: AuthService,
              private articleService: ArticleService,
              private commentService: CommentService,
              private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .pipe(
          switchMap((article: ArticleType) => {
            this.article = article;
            return this.articleService.getRelatedArticles(params['url'])
          })
        )
        .subscribe((data: ArticleType[]) => {
          this.relatedArticles = data;
          this.getUserActionsForComments();
        })
    })
  }

  onCommentInput(event: Event): void {
    this.newCommentText = (event.target as HTMLTextAreaElement).value;
  }

  addComment(): void {
    const comment: NewCommentType = {
      text: this.newCommentText,
      article: this.article.id
    }
    this.commentService.addComment(comment)
      .subscribe({
        next: (data: DefaultResponseType) => {
          this._snackBar.open(data.message);
        },
        error: (err: Error) => {
          console.log(err.message);
        }
      })

    this.articleService.getArticle(this.article.url)
      .subscribe((data: ArticleType) => {
        this.article.comments = data.comments;
      })
    this.getUserActionsForComments();
  }

  loadComments(offset: number): void {
    this.commentService.getComments(offset, this.article.id)
      .subscribe((data: CommentsResponseType) => {
        data.comments.forEach((comment: CommentType) => {
          if (this.article.comments) {
            this.article.comments.push(comment);
          }
        })
        this.getUserActionsForComments();
      })
  }

  getUserActionsForComments(): void {
    this.commentService.getUserActionsForComments(this.article.id)
      .subscribe(data => {
        if (data as UserActionType[]) {
          this.userActions = data as UserActionType[];
        }
        this.processUserActions();
      })
  }

  processUserActions(): void {
    if (this.article.comments) {
      this.article.comments.forEach((commentItem: CommentType) => {
        commentItem.action = '';
        this.userActions.forEach((actionItem: UserActionType) => {
          if (commentItem.id === actionItem.comment) {
            commentItem.action = actionItem.action;
          }
        })
      })
    }
  }

  applyAction(action: string, id: string): void {
    if (this.article.comments) {
      const comment: CommentType | undefined = this.article.comments.find((item: CommentType) => item.id === id);
      if (action === 'like') {
        if (comment?.action === 'like') {
          comment.action = '';
          comment.likesCount--;
        } else {
          if (comment?.action === 'dislike') {
            comment.dislikesCount--;
          }
          comment!.action = 'like';
          comment!.likesCount++;
        }
        this.sendAction('like', id);
      }

      if (action === 'dislike') {
        if (comment?.action === 'dislike') {
          comment.action = '';
          comment.dislikesCount--;
        } else {
          if (comment?.action === 'like') {
            comment.likesCount--;
          }
          comment!.action = 'dislike';
          comment!.dislikesCount++;
        }
        this.sendAction('dislike', id);
      }
    }
  }

  sendAction(action: string, id: string): void {
    this.commentService.applyAction(action, id)
      .subscribe({
        next: () => {
          this._snackBar.open('Ваш голос учтен');
        },
        error: () => {
          // this._snackBar.open('');
        }
      })
  }

  sendComplaint(id: string): void {
    this.commentService.applyAction('violate', id)
      .subscribe({
        next: () => {
          this._snackBar.open('Жалоба отправлена');
        },
        error: () => {
          this._snackBar.open('Жалоба уже отправлена');
        }
      })
  }
}
