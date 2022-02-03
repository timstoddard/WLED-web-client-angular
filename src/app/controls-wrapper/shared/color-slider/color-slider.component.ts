import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements OnInit, AfterViewInit {
  @Input() control!: AbstractControl;
  @Input() min!: number;
  @Input() max!: number;
  @Input() label: string = '';
  @Input() labelClass: string = '';
  @Input() sliderClass: string = '';
  // TODO change default styles based on vertical setting
  @Input() vertical: boolean = false;
  @Output() slideChange = new EventEmitter<number>();
  @Output() slideInput = new EventEmitter<number>();
  @ViewChild('sliderDisplay', { read: ElementRef }) sliderDisplay!: ElementRef;

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (typeof this.min !== 'number') {
      console.error(
        `Min missing from slider. See element:`,
        this.sliderDisplay);
    }
    if (typeof this.max !== 'number') {
      console.error(
        `Max missing from slider. See element:`,
        this.sliderDisplay);
    }
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
