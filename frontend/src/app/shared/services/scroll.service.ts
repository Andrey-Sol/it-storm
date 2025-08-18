import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { ViewportScroller } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor(private router: Router,
              private viewportScroller: ViewportScroller) { }

  scrollPage(fragment: string): void {
    this.router.navigate(['/']);
    setTimeout(() => {
      this.viewportScroller.scrollToAnchor(fragment);
    }, 100);
  }
}
