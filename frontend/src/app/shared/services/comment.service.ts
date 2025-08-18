import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { CommentsResponseType } from "../../../types/comments-response.type";
import { NewCommentType } from "../../../types/new-comment.type";
import { DefaultResponseType } from "../../../types/default-response.type";
import { UserActionType } from "../../../types/user-action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(offset: number, articleId: string): Observable<CommentsResponseType> {
    const params: HttpParams = new HttpParams().set("offset", offset).set("article", articleId);
    return this.http.get<CommentsResponseType>(environment.api + 'comments', {params});
  }

  addComment(comment: NewCommentType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', comment);
  }

  applyAction(action: string, id: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {action})
  }

  getActionsForComment(id: string): Observable<UserActionType[] | DefaultResponseType> {
    return this.http.get<UserActionType[] | DefaultResponseType>(environment.api + 'comments/' + id + '/actions');
  }

  getUserActionsForComments(articleId: string): Observable<UserActionType[] | DefaultResponseType> {
    const params: HttpParams = new HttpParams().set("articleId", articleId);
    return this.http.get<UserActionType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {params});
  }
}
