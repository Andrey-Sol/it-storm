import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from "./components/article-card/article-card.component";
import { RouterModule } from "@angular/router";
import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ModalComponent } from './components/modal/modal.component';
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { CloseFilterDirective } from "./directives/close-filter.directive";


@NgModule({
  declarations: [
    ArticleCardComponent,
    LoaderComponent,
    ModalComponent,
    CloseFilterDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  exports: [
    ArticleCardComponent,
    LoaderComponent,
    CloseFilterDirective
  ]
})
export class SharedModule { }
