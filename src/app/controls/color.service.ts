import { Injectable } from '@angular/core';
import iro from '@jaames/iro';

import { ApiHttpService } from '../shared/api-http.service';
import { ControlsModule } from './controls.module';
import { asHtmlElem, getInput, updateSliderTrail } from './utils';

@Injectable({ providedIn: ControlsModule })
export class ColorService {
  private selectedColorSlot = 0;
  private whites = [0, 0, 0]; // white values, if rbgw enabled
  private colorPicker!: iro.ColorPicker;

  constructor(private apiHttp: ApiHttpService) { }

  setColorPicker(colorPicker: iro.ColorPicker) {
    this.colorPicker = colorPicker;
  }

  setColorPickerColor(rgb: string) {
    const color = new iro.Color(rgb);
    if (color.value > 0) {
      this.colorPicker.color.set(color);
    } else {
      this.colorPicker.color.setChannel('hsv', 'v', 0);
    }
  }

  fromV() {
    this.colorPicker.color.setChannel('hsv', 'v', parseInt(getInput('sliderV').value, 10));
  }

  fromK() {
    const kelvin = parseInt(getInput('sliderK').value, 10);
    this.colorPicker.color.set({ kelvin: kelvin });
  }

  fromRgb() {
    const r = getInput('sliderR').value;
    const g = getInput('sliderG').value;
    const b = getInput('sliderB').value;
    this.setColorPickerColor(`rgb(${r},${g},${b})`);
  }

  // TODO maybe split this up, one function per input type?
  /**
   * Sets the color based on what color input it came from.
   * @param colorInputType
   * - 0: from RGB sliders
   * - 1: from picker
   * - 2: from hex
   */
  setColorByInputType(colorInputType: number) {
    const cd = document.getElementById('csl')!.children;

    // if picker, and something's(??) background is black
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
      this.whites[this.selectedColorSlot] = parseInt(getInput('sliderW').value);
    }
    const col = this.colorPicker.color.rgb;
    let obj = {
      seg: {
        col: [[col.r, col.g, col.b, this.whites[this.selectedColorSlot]], [], []],
      },
    };

    // if picker
    if (this.selectedColorSlot === 1) {
      obj = {
        seg: {
          col: [[], [col.r, col.g, col.b, this.whites[this.selectedColorSlot]], []],
        },
      };

      // if hex
    } else if (this.selectedColorSlot === 2) {
      obj = {
        seg: {
          col: [[], [], [col.r, col.g, col.b, this.whites[this.selectedColorSlot]]],
        },
      };
    }

    // TODO
    // this.requestJson(obj);
  }

  /**
   * Selects one of the 3 color slots.
   * @param slot 0, 1, or 2
   */
  selectSlot(slot: number) {
    this.selectedColorSlot = slot;
    const cd = document.getElementById('csl')!.children;

    // TODO render selected slot with emphasized style
    // for (let i = 0; i < cd.length; i++) {
    //   cd[i].style.border = '2px solid white';
    //   cd[i].style.margin = '5px';
    //   cd[i].style.width = '42px';
    // }
    // cd[this.selectedColorSlot].style.border = '5px solid white';
    // cd[this.selectedColorSlot].style.margin = '2px';
    // cd[this.selectedColorSlot].style.width = '50px';

    const selectedSlot = asHtmlElem(cd[this.selectedColorSlot]);
    this.setColorPickerColor(selectedSlot.style.backgroundColor);
    // force slider update on initial load (picker "color:change" not fired if black)
    if (this.colorPicker.color.value === 0) {
      this.updatePSliders();
    }
    getInput('sliderW').value = `${this.whites[this.selectedColorSlot]}`;
    updateSliderTrail(getInput('sliderW'));

    // TODO render palettes (?)
    // this.redrawPalPrev();
  }

  /**
   * Updates various color input sliders.
   */
  updatePSliders() {
    this.updateRgbSliders();
    this.updateHexInput();
    this.updateValueSlider();
    this.updateKelvinSlider();
  }

  private updateRgbSliders() {
    const color = this.colorPicker.color.rgb;
    const sliderR = getInput('sliderR');
    sliderR.value = `${color.r}`;
    updateSliderTrail(sliderR /* , 1 */);
    const sliderG = getInput('sliderG');
    sliderG.value = `${color.g}`;
    updateSliderTrail(sliderG /* , 2 */);
    const sliderB = getInput('sliderB');
    sliderB.value = `${color.b}`;
    updateSliderTrail(sliderB /* , 3 */);
  }

  private updateHexInput() {
    let str = this.colorPicker.color.hexString.substring(1);
    const whiteValue = this.whites[this.selectedColorSlot];
    if (whiteValue > 0) {
      str += whiteValue.toString(16);
    }
    getInput('hexc').value = str;
    document.getElementById('hexcnf')!.style.backgroundColor = 'var(--c-3)';
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
    updateSliderTrail(v);
  }
  
  private updateKelvinSlider() {
    getInput('sliderK').value = `${this.colorPicker.color.kelvin}`;
  }
}
