import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { UserInfoType } from "../../../types/user-info.type";
import { DefaultResponseType } from "../../../types/default-response.type";
import { Observable } from "rxjs";
import { ServiceType } from "../../../types/service.type";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  services: ServiceType[] = [
    {
      image: 'service1.png',
      name: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500'
    },
    {
      image: 'service2.png',
      name: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500'
    },
    {
      image: 'service3.png',
      name: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000'
    },
    {
      image: 'service4.png',
      name: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: ' 750'
    },
  ]

  constructor(private http: HttpClient) { }

  getServices(): ServiceType[] {
    return this.services;
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users');
  }

  newRequest(requestData: any): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', requestData);
  }
}
