import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

interface ColorSliderProps {
  controlName: string;
  min: number;
  max: number;
  label: string;
}

@Component({
  selector: 'app-color-and-whiteness-sliders',
  templateUrl: './color-and-whiteness-sliders.component.html',
  styleUrls: ['./color-and-whiteness-sliders.component.scss']
})
export class ColorAndWhitenessSlidersComponent {
  @Input() colorAndWhitenessSettings!: AbstractControl;
  colorSliderProps = this.getColorSliders();

  private getColorSliders(): ColorSliderProps[] {
    return [
      {
        controlName: 'hsvValue',
        min: 0,
        max: 255,
        label: 'HSV value',
      },
      {
        controlName: 'kelvin',
        min: 1900,
        max: 10091,
        label: 'Kelvin',
      },
      {
        controlName: 'whiteChannel',
        min: 0,
        max: 255,
        label: 'White channel',
      },
      {
        controlName: 'whiteBalance',
        min: 0,
        max: 255,
        label: 'White balance',
      }
    ];
  }
}
