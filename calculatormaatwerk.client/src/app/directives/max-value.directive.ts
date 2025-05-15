import { Directive, Input, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMax]'
})
export class MaxValueDirective {
  @Input() appMax: number = 0;
  constructor(@Self() private ngControl: NgControl) {}
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);

    if (value > this.appMax) {
      this.ngControl.control?.setErrors({ max: true });
    } else {
      this.ngControl.control?.setErrors(null);
    }
  }
}