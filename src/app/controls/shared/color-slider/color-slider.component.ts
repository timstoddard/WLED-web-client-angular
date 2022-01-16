import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 255;
const DEFAULT_VALUE = 128;

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements OnInit {
  // TODO should this be an input? or a private field owned by this class?
  @Input() control!: AbstractControl;
  @Input() min: number = DEFAULT_MIN;
  @Input() max: number = DEFAULT_MAX;
  @Input() value: number = DEFAULT_VALUE;
  @Input() label: string = '';
  @Input() class: string = '';
  @Output() slideChange = new EventEmitter<number>();
  @Output() slideInput = new EventEmitter<number>();
  @ViewChild('sliderDisplay', { read: ElementRef }) sliderDisplay!: ElementRef;
  formControl!: FormControl;

  ngOnInit() {
    this.formControl = this.control as FormControl;
    if (this.formControl) {
      this.formControl.setValue(this.value);
    }
  }

  onChange(event: Event) {
    this.slideChange.emit(this.formControl.value); // TODO or emit e?
    this.updateSliderTrail(event);
  }

  onInput(event: Event) {
    this.slideInput.emit(this.formControl.value);
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

    let percent = this.formControl.value / this.max * 100;

    // TODO keep?
    // if (percent < 50) {
    //   percent += 2;
    // }

    const val = `linear-gradient(90deg, var(--bg) ${percent}%, var(--c-4) ${percent}%)`;
    this.sliderDisplay.nativeElement.style.background = val;
  }
}
