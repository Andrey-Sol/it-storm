import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ArticleService } from "../../../shared/services/article.service";
import { ActivatedRoute } from "@angular/router";
import { ArticleType } from "../../../../types/article.type";
import { environment } from "../../../../environments/environment";
import { CommentService } from "../../../shared/services/comment.service";
import { CommentType } from "../../../../types/comment.type";
import { CommentsResponseType } from "../../../../types/comments-response.type";
import { NewCommentType } from "../../../../types/new-comment.type";
import { switchMap } from "rxjs";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {

  serverStaticPath = environment.serverStaticPath;
  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  comments: CommentType[] = [];
  newCommentText = '';

  constructor(private articleService: ArticleService,
              private commentService: CommentService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      // this.params = params;
      this.articleService.getArticle(params['url'])
        .pipe(
          switchMap((article: ArticleType) => {
            this.article = article;
            return this.commentService.getComments(3, this.article.id)
          })
        )
        .subscribe((data: CommentsResponseType) => {
          this.comments = data.comments;
        })

      this.articleService.getRelatedArticles(params['url'])
        .subscribe((data: ArticleType[]) => {
          this.relatedArticles = data;
        })
    })
    // console.log(this.comments);
  }

  onCommentInput(event: Event) {
    this.newCommentText = (event.target as HTMLTextAreaElement).value;
  }

  addComment() {
    const comment: NewCommentType = {
      text: this.newCommentText,
      article: this.article.id
    }
    this.commentService.addComment(comment);
  }
}
