import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[outlinedIcon]'
})
export class OutlinedIconDirective {

  private readonly outlinedClass: string = 'material-icons-outlined';
  private element = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() { }

  @HostListener('mouseenter') onMouseEnter(): void {
    this.toggleOutline(false);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.toggleOutline(true);
  }

  private toggleOutline(isMouseOutside: boolean): void {
    const icon = this.element.nativeElement.querySelector('mat-icon');
    if (icon) {
      if (isMouseOutside) {
        this.renderer.addClass(icon, this.outlinedClass);
      } else {
        this.renderer.removeClass(icon, this.outlinedClass);
      }
    }
  }


}
