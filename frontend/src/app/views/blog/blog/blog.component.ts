import { Component, OnInit } from '@angular/core';
import { ArticleType } from "../../../../types/article.type";
import { ArticleService } from "../../../shared/services/article.service";
import { CategoryType } from "../../../../types/category.type";
import { ActivatedRoute, Router } from "@angular/router";
import { ActiveParamsType } from "../../../../types/active-params.type";
import { AppliedFilterType } from "../../../../types/applied-filter.type";
import { debounceTime } from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  filterOpen: boolean = false;
  pages: number[] = [];

  constructor(private articleService: ArticleService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.articleService.getCategories()
      .subscribe(data => {
        this.categories = data;
        this.activatedRoute.queryParams
          .pipe(debounceTime(500))
          .subscribe(params => {
            this.processParams(params);
          });
      });
  }

  private processParams(params: {[key: string]: string}): void {
    // Создаем новый объект параметров
    const newActiveParams: ActiveParamsType = { categories: [], page: 1 };
    // Обрабатываем параметры категорий
    if (params['categories']) {
      newActiveParams.categories = Array.isArray(params['categories'])
        ? params['categories']
        : [params['categories']];
    }
    // Обрабатываем параметр страницы
    if (params['page']) {
      newActiveParams.page = +params['page'];
    }
    // Обновляем активные параметры
    this.activeParams = newActiveParams;
    // Обновляем примененные фильтры
    this.updateAppliedFilters();
    // Загружаем статьи
    this.loadArticles();
  }

  private updateAppliedFilters(): void {
    this.appliedFilters = [];
    this.activeParams.categories.forEach(url => {
      const foundCategory = this.categories.find(category => category.url === url);
      if (foundCategory) {
        this.appliedFilters.push({
          name: foundCategory.name,
          urlParam: foundCategory.url
        });
      }
    });
  }

  private loadArticles(): void {
    this.articleService.getArticles(this.activeParams)
      .subscribe(data => {
        this.pages = [];
        for (let i = 1; i <= data.pages; i++) {
          this.pages.push(i);
        }
        this.articles = data.items;
      });
  }

  updateFilterParam(url: string, checked: boolean): void {
    // Создаем копию активных параметров
    const updatedParams: ActiveParamsType = {
      ...this.activeParams,
      categories: [...this.activeParams.categories]
    };
    if (checked) {
      // Если чекбокс отмечен, добавляем категорию
      if (!updatedParams.categories.includes(url)) {
        updatedParams.categories.push(url);
      }
    } else {
      // Если чекбокс снят, удаляем категорию
      updatedParams.categories = updatedParams.categories.filter(item => item !== url);
    }
    // Всегда сбрасываем на первую страницу при изменении фильтров
    updatedParams.page = 1;
    // Обновляем URL
    this.updateUrl(updatedParams);
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType): void {
    // Создаем копию активных параметров без удаленного фильтра
    const updatedParams: ActiveParamsType = {
      ...this.activeParams,
      categories: this.activeParams.categories.filter(item => item !== appliedFilter.urlParam),
      page: 1 // Сбрасываем на первую страницу
    };
    // Обновляем URL
    this.updateUrl(updatedParams);
  }

  private updateUrl(params: ActiveParamsType): void {
    // Удаляем пустые параметры
    const queryParams: { page?: number, categories?: string[] } = { ...params };
    if (queryParams.categories && queryParams.categories.length === 0) {
      delete queryParams.categories;
    }
    // if (!queryParams.page || queryParams.page === 1) {
    //   delete queryParams.page;
    // }
    this.router.navigate(['/blog'], {
      queryParams: queryParams,
      // queryParamsHandling: 'merge' // Для сохранения других параметров URL
    });
  }

  toggleFilter(): void {
    this.filterOpen = !this.filterOpen;
  }

  openPage(page: number): void {
    this.updateUrl({
      ...this.activeParams,
      page: page
    });
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.openPage(this.activeParams.page - 1);
    }
  }

  openNextPage(): void {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.openPage(this.activeParams.page + 1);
    }
  }

  closeFilter(event: boolean): void {
    this.filterOpen = event;
  }
}
