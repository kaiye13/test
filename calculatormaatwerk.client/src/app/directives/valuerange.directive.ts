import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appValueRange]'
})
export class ValueRangeDirective {
  @Input('appMinValue') minValue!: number;
  @Input('appMaxValue') maxValue!: number;
  @Input('appErrorMessage') errorMessage!: string;
  @Output() validityChange = new EventEmitter<boolean>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const inputValue = parseFloat(value);
    const errorElement = this.el.nativeElement.nextElementSibling?.nextElementSibling;
    const span = this.el.nativeElement.nextElementSibling;
    if (inputValue < this.minValue || inputValue > this.maxValue) {
      this.renderer.addClass(this.el.nativeElement, 'invalid-input');
      if (errorElement) {
        this.renderer.setStyle(errorElement, 'display', 'block');
        this.renderer.setStyle(span, 'top', '34%');
        errorElement.textContent = this.errorMessage;
      }
      this.validityChange.emit(false);
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'invalid-input');
      if (errorElement) {
        this.renderer.setStyle(errorElement, 'display', 'none');
        this.renderer.setStyle(span, 'top', '50%');
      }
      this.validityChange.emit(true);
    }
  }
}