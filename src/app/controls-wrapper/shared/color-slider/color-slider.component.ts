import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { Subject, throttleTime } from 'rxjs';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';

// TODO make this a setting
const THROTTLE_MAX_FPS = 60;

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent extends UnsubscriberComponent implements OnInit, AfterViewInit {
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
  private sliderInput$!: Subject<MatSliderChange>;

  ngOnInit() {
    this.sliderInput$ = new Subject();
  }

  ngAfterViewInit() {
    this.checkMinMaxInputs();

    this.handleUnsubscribe(this.sliderInput$)
      .pipe(throttleTime(1000 / THROTTLE_MAX_FPS))
      .subscribe(({ value }) => {
        this.control.patchValue(value);
      });
  }

  getFormControl() {
    return this.control as FormControl;
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

  updateFormControl(changeEvent: MatSliderChange) {
    this.sliderInput$.next(changeEvent);
  }

  // TODO find slider library that can handle gradient slider trails
  /**
   * Updates the colored in background to the left of the slider button.
   * Updates the 'sliderdisplay' background div of a slider for a visual indication of slider position.
   * @param event 
   * @returns 
   */
  private updateSliderTrail = () => {
    let percent = this.control.value / this.max * 100;

    const backgroundGradient = `
      linear-gradient(
        90deg,
        var(--bg) ${percent}%,
        var(--c-4) ${percent}%
      )`;
    this.sliderDisplay.nativeElement.style.background = backgroundGradient;
  }
}
