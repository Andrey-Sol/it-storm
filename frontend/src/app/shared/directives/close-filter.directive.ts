import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[closeFilter]'
})
export class CloseFilterDirective {

  @Output() clickOutside = new EventEmitter<boolean>();

  constructor(private element: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  click(targetElement: any) {
    const clickedInside = this.element.nativeElement.contains(targetElement);
    if (clickedInside) {
      this.clickOutside.emit(true);
    } else  {
      this.clickOutside.emit(false);
    }
  }
}
