import { AfterViewInit, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';

// TODO make this a setting
const THROTTLE_THRESHOLD_MS = 10;

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements AfterViewInit {
  @HostBinding('class.colorSlider__vertical') verticalClass!: boolean;
  @Input() control!: AbstractControl;
  @Input() min!: number;
  @Input() max!: number;
  @Input() label: string = '';
  @Input() labelClass: string = '';
  @Input() sliderClass: string = '';
  @Input() set vertical(isVertical: boolean) {
    this.isVertical = isVertical;
    this.verticalClass = this.isVertical;
  }
  @ViewChild('slider', { read: ElementRef }) slider!: ElementRef;
  @ViewChild('sliderDisplay', { read: ElementRef }) sliderDisplay!: ElementRef;
  isVertical: boolean = false;
  private previousThrottleMs = Number.NEGATIVE_INFINITY;

  ngAfterViewInit() {
    this.checkMinMaxInputs();
  }

  getFormControl() {
    return this.control as FormControl;
  }

  updateFormControl({ value }: MatSliderChange) {
    const now = Date.now();
    // custom throttle implementation
    if (now - this.previousThrottleMs > THROTTLE_THRESHOLD_MS) {
      this.control.patchValue(value);
      this.previousThrottleMs = now;
    }
  }

  /**
   * Updates the colored in background to the left of the slider button.
   * Updates the 'sliderdisplay' background div of a slider for a visual indication of slider position.
   * @param event 
   * @returns 
   */
  updateSliderTrail = (event: Event) => {
    // if (!event) {
    //   return;
    // }

    let percent = this.control.value / this.max * 100;

    // TODO keep?
    // if (percent < 50) {
    //   percent += 2;
    // }

    const val = `linear-gradient(90deg, var(--bg) ${percent}%, var(--c-4) ${percent}%)`;
    this.sliderDisplay.nativeElement.style.background = val;
  }

  private checkMinMaxInputs() {
    if (typeof this.min !== 'number') {
      console.error(
        `Required 'min' input missing from slider. See element:`,
        this.slider.nativeElement);
    }
    if (typeof this.max !== 'number') {
      console.error(
        `Required 'max' input missing from slider. See element:`,
        this.slider.nativeElement);
    }
  }
}
