import { Component, HostListener, OnInit } from '@angular/core';
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
  filterOpen = false;
  pages: number[] = [];

  constructor(private articleService: ArticleService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    console.log(event.target);
    if (this.filterOpen && (event.target as HTMLElement).className.indexOf('blog-filter') === -1) {
      this.filterOpen = false;
    } else if ((event.target as HTMLElement).className.includes('blog-filter-body')
     || (event.target as HTMLElement).className.includes('blog-filter-item')  ) {
      this.filterOpen = true;
    }
  }

  ngOnInit(): void {
    this.articleService.getCategories()
      .subscribe(data => {
        this.categories = data;
      })

    this.activatedRoute.queryParams
      .pipe(
        debounceTime(500),
      )
      .subscribe(params => {
      const activeParams: ActiveParamsType = {categories: []};

      if (params.hasOwnProperty('categories')) {
        if (params['categories']) {
          activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
        }
      }

      // this.activeParams = activeParams;
      // this.activeParams.categories = params['categories'];

      this.appliedFilters = [];

      this.activeParams.categories.forEach(url => {
        const foundCategory = this.categories.find(category => category.url === url);
        if (foundCategory) {
          this.appliedFilters.push({
            name: foundCategory.name,
            urlParam: foundCategory.url
          })
        }
      })

      this.articleService.getArticles(this.activeParams)
        .subscribe(data => {
          this.pages = [];
          for (let i = 1; i <= data.pages; i++) {
            this.pages.push(i);
          }
          this.articles = data.items;
        })
    })
  }

  updateFilterParam(url: string, checked: boolean): void {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item === url);
      if (existingCategoryInParams && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingCategoryInParams && checked) {
        this.activeParams.categories.push(url);
        // this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else if (checked) {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType): void {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page > this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }
}
