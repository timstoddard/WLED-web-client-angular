import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

// TODO remove defaults?
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 255;

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements OnInit {
  @Input() control!: AbstractControl;
  @Input() min: number = DEFAULT_MIN;
  @Input() max: number = DEFAULT_MAX;
  @Input() label: string = '';
  @Input() class: string = '';
  @Output() slideChange = new EventEmitter<number>();
  @Output() slideInput = new EventEmitter<number>();
  @ViewChild('sliderDisplay', { read: ElementRef }) sliderDisplay!: ElementRef;

  ngOnInit() {
  }

  getFormControl() {
    return this.control as FormControl;
  }

  // TODO seems like we only really need onChange and not onInput
  onChange(event: Event) {
    // this.slideChange.emit(this.control.value); // TODO or emit e?
    this.updateSliderTrail(event);
  }

  onInput(event: Event) {
    // this.slideInput.emit(this.control.value);
    this.updateSliderTrail(event);
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
}
