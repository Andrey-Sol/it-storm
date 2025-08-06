import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { CommentsResponseType } from "../../../types/comments-response.type";
import { NewCommentType } from "../../../types/new-comment.type";
import { DefaultResponseType } from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(offset: number, article: string): Observable<CommentsResponseType> {
    const params =  {offset: offset, article: article}
    return this.http.get<CommentsResponseType>(environment.api + 'comments', {params});
  }

  addComment(comment: NewCommentType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', comment);
  }

  applyAction(action: string, id: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', action)
  }
}
