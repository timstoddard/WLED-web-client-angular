import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { Subject, throttleTime } from 'rxjs';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';

// TODO make this a setting
// increasing this value makes the slider drag UX "choppy"
const API_THROTTLE_MAX_FPS = 4;

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
  @Input() matIconName: string = '';
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

    this.patchValueWhileDragging();
  }

  getFormControl() {
    return this.control as FormControl;
  }

  updateFormControl(newValue: MatSliderChange) {
    this.sliderInput$.next(newValue);
  }

  /**
   * The control value normally only updates when the slider is released.
   * This subject is set up to emit while the slider is being dragged.
   * The value patching is throttled so as not to overwhelm any API calls
   * that are wired up to the control.
   */
  private patchValueWhileDragging() {
    this.handleUnsubscribe(this.sliderInput$)
      .pipe(throttleTime(1000 / API_THROTTLE_MAX_FPS))
      .subscribe(({ value }) => {
        this.control.patchValue(value);
      });
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
