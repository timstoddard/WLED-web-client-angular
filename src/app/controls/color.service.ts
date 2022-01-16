import { Injectable } from '@angular/core';
import iro from '@jaames/iro';
import { Subject } from 'rxjs';

import { ApiHttpService } from '../shared/api-http.service';
import { ControlsModule } from './controls.module';
import { asHtmlElem, getInput } from './utils';

// TODO should be able to provide in controls module
// @Injectable({ providedIn: ControlsModule })
@Injectable({ providedIn: 'root' })
export class ColorService {
  private colorChange = new Subject<void>(); // TODO wire up listeners to color changes
  private colorPicker!: iro.ColorPicker;
  private selectedColorSlot = 0;
  private whites = [0, 0, 0]; // white values, if rbgw enabled

  constructor(private apiHttp: ApiHttpService) { }

  getColorPicker() {
    return this.colorPicker;
  }

  setColorPicker(colorPicker: iro.ColorPicker) {
    this.colorPicker = colorPicker;
  }

  getSelectedSlot() {
    return this.selectedColorSlot;
  }

  setColorPickerColor(rgb: string) {
    console.log('settings', rgb)
    const color = new iro.Color(rgb);
    console.log(color, color.value)
    if (color.value > 0) {
      this.colorPicker.color.set(color);
    } else {
      this.colorPicker.color.setChannel('hsv', 'v', 0);
    }
  }

  fromV(value: number) { // TODO better names
    this.colorPicker.color.setChannel('hsv', 'v', value);
  }

  fromK(kelvin: number) {
    this.colorPicker.color.set({ kelvin });
  }

  fromRgb(r: number, g: number, b: number) {
    // const r = getInput('sliderR').value;
    // const g = getInput('sliderG').value;
    // const b = getInput('sliderB').value;
    this.setColorPickerColor(`rgb(${r},${g},${b})`);
  }

  updateWhiteValue(whiteValue: number) {
    this.whites[this.selectedColorSlot] = whiteValue;
  }

  setBalance(balance: number) {
    // TODO implement
  }

  // TODO maybe split this up, one function per input type?
  /**
   * Sets the color based on what color input it came from.
   * @param colorInputType 0: from RGB sliders, 1: from picker, 2: from hex
   */
  setColorByInputType(colorInputType: number) {
    const cd = document.getElementById('csl')!.children;

    // if picker, and selected slot's curr color black
    const selectedSlot = asHtmlElem(cd[this.selectedColorSlot]);
    if (
      colorInputType === 1 &&
      selectedSlot.style.backgroundColor === 'rgb(0,0,0)'
    ) {
      this.colorPicker.color.setChannel('hsv', 'v', 100);
    }
    selectedSlot.style.backgroundColor = this.colorPicker.color.rgbString;

    // if not hex
    if (colorInputType !== 2) {
      // TODO get white slider value
      this.whites[this.selectedColorSlot] = 0; // parseInt(getInput('sliderW').value);
    }
    const col = this.colorPicker.color.rgb;
    const newColor = [col.r, col.g, col.b, this.whites[this.selectedColorSlot]];
    let obj = {
      seg: {
        col: [newColor, [], []],
      },
    };

    // if picker
    if (this.selectedColorSlot === 1) {
      obj = {
        seg: {
          col: [[], newColor, []],
        },
      };

      // if hex
    } else if (this.selectedColorSlot === 2) {
      obj = {
        seg: {
          col: [[], [], newColor],
        },
      };
    }

    // TODO api call
    // this.requestJson(obj);
  }

  /**
   * Selects one of the 3 color slots.
   * @param slot 0, 1, or 2
   */
  selectSlot(slot: number) {
    this.selectedColorSlot = slot;

    // TODO set colorPicker color = selected slot color
    // const cd = document.getElementById('csl')!.children;
    // const selectedSlot = asHtmlElem(cd[this.selectedColorSlot]);
    // this.setColorPickerColor(selectedSlot.style.backgroundColor);

    // force slider update on initial load (picker "color:change" not fired if black)
    if (this.colorPicker.color.value === 0) {
      this.updatePSliders();
    }

    // TODO render palettes (?)
    // this.redrawPalPrev();
  }

  /**
   * Updates various color input sliders.
   */
  updatePSliders() {
    // TODO update the components, not the sliders directly
    // this.updateRgbSliders();
    // this.updateHexInput();
    // this.updateValueSlider();
    // this.updateKelvinSlider();
    // this.updateWhiteSlider();
  }

  private updateRgbSliders() {
    const color = this.colorPicker.color.rgb;
    const sliderR = getInput('sliderR');
    sliderR.value = `${color.r}`;
    const sliderG = getInput('sliderG');
    sliderG.value = `${color.g}`;
    const sliderB = getInput('sliderB');
    sliderB.value = `${color.b}`;
  }

  private updateHexInput() {
    let str = this.colorPicker.color.hexString.substring(1);
    const whiteValue = this.whites[this.selectedColorSlot];
    if (whiteValue > 0) {
      str += whiteValue.toString(16);
    }
    
    // TODO set hex input value
    // getInput('hexc').value = str;

    // TODO update button style
    // document.getElementById('hexcnf')!.style.backgroundColor = 'var(--c-3)';
  }

  private updateValueSlider() {
    const v = getInput('sliderV');
    v.value = `${this.colorPicker.color.value}`;
    
    // background color as if color had full value
    const hsv = {
      h: this.colorPicker.color.hue,
      s: this.colorPicker.color.saturation,
      v: 100,
    };
    const c = iro.Color.hsvToRgb(hsv);
    const cs = `rgb(${c.r},${c.g},${c.b})`;
    ((v.parentNode! as HTMLElement)
      .getElementsByClassName('sliderdisplay')[0] as HTMLElement)
      .style.setProperty('--bg', cs);
    // updateSliderTrail(v);
  }
  
  private updateKelvinSlider() {
    getInput('sliderK').value = `${this.colorPicker.color.kelvin}`;
  }

  private updateWhiteSlider() {
    getInput('sliderW').value = `${this.whites[this.selectedColorSlot]}`;
    // updateSliderTrail(getInput('sliderW'));
  }
}
