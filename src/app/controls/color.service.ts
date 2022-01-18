import { Injectable } from '@angular/core';
import { IroColorValue, RgbColor } from '@irojs/iro-core';
import iro from '@jaames/iro';
import { BehaviorSubject } from 'rxjs';

import { ApiHttpService } from '../shared/api-http.service';
import { ControlsModule } from './controls.module';

export interface CurrentColor {
  rgb: RgbColor;
  whiteValue: number;
  hex: string;
  hsvValue: number;
  kelvin: number;
}

type WhiteValues = [number, number, number];

const DEFAULT_WHITE_CHANNEL_VALUE = 128;
const DEFAULT_WHITE_BALANCE = 128; // TODO use this
const DEFAULT_R = 128;
const DEFAULT_G = 128;
const DEFAULT_B = 128;
const DEFAULT_HSV_VALUE = 128;
const DEFAULT_KELVIN = 6550;
const DEFAULT_SLOT = 0;
const DEFAULT_WHITE_VALUES: WhiteValues = [0, 0, 0];
const DEFAULT_SLOT_COLORS = [
  'rgb(0,0,0)',
  'rgb(0,0,0)',
  'rgb(0,0,0)',
];

// TODO should be able to provide in controls module
// @Injectable({ providedIn: ControlsModule })
@Injectable({ providedIn: 'root' })
export class ColorService {
  private colorPicker!: iro.ColorPicker;
  private selectedColorSlot = DEFAULT_SLOT; // TODO maybe doesnt belong here?
  // white values, if rbgw enabled
  private whites: WhiteValues = DEFAULT_WHITE_VALUES;
  private currentColorData = new BehaviorSubject<CurrentColor>(this.getDefaults());

  constructor(private apiHttp: ApiHttpService) {}

  getCurrentColorData() {
    return this.currentColorData;
  }

  getColorPicker() {
    return this.colorPicker;
  }

  setColorPicker(colorPicker: iro.ColorPicker) {
    colorPicker.on('input:end', () => {
      this.emitNewColor();
      // this.setColorByInputType(1);
    });
    colorPicker.on('color:change', () => {
      this.emitNewColor();
    });

    this.colorPicker = colorPicker;
  }

  setColorPickerColor(color: IroColorValue) {
    const newColor = new iro.Color(color);
    if (newColor.value > 0) {
      this.colorPicker.color.set(newColor);
    } else {
      this.colorPicker.color.setChannel('hsv', 'v', 0);
    }
    // TODO update form (?)
  }

  setHsvValue(hsvValue: number) {
    // TODO when this is 0, kelvin
    this.colorPicker.color.setChannel('hsv', 'v', hsvValue);
  }

  setKelvin(kelvin: number) {
    this.colorPicker.color.set({ kelvin });
  }

  setRgb(r: number, g: number, b: number) {
    const rgb = `rgb(${r},${g},${b})`;
    this.setColorPickerColor(rgb);
  }

  setWhiteValue(whiteValue: number) {
    this.whites[this.selectedColorSlot] = whiteValue;
  }

  setWhiteBalance(whiteBalance: number) {
    // TODO save white balance (update color picker?)

    // TODO api call
    // var obj = { "seg": { "cct": parseInt(b) } };
    // requestJson(obj);
  }

  setHex(hex: string, whiteValue: number) {
    this.setWhiteValue(whiteValue);
    try {
      this.setColorPickerColor(`#${hex}`);
    } catch (e) {
      // TODO alert message instead?
      // this.setColorPickerColor(DEFAULT_COLOR);
    }
    // TODO not needed?
    // this.setColorByInputType(2);
  }

  // TODO maybe split this up, one function per input type?
  /**
   * Sets the color based on what color input it came from.
   * @param colorInputType 0: from RGB sliders, 1: from picker, 2: from hex
   */
  setColorByInputType(colorInputType: number) {}

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

    // TODO is this needed?
    // force slider update on initial load (picker "color:change" not fired if black)
    if (this.colorPicker.color.value === 0) {
      this.emitNewColor();
    }

    // TODO render palettes
    // this.redrawPalPrev();
  }

  getSelectedSlot() {
    return this.selectedColorSlot;
  }

  /**
   * Updates various color input sliders.
   */
  emitNewColor() {
    const rgb = this.colorPicker.color.rgb;
    const kelvin = this.colorPicker.color.kelvin;
    const hsvValue = this.colorPicker.color.value;
    const whiteValue = this.whites[this.selectedColorSlot];
    let hexString = this.colorPicker.color.hexString.substring(1);
    const hex = whiteValue > 0
      ? hexString + whiteValue.toString(16)
      : hexString;
    const newColor: CurrentColor = {
      rgb,
      whiteValue,
      hex,
      hsvValue,
      kelvin,
    };
    this.currentColorData.next(newColor);

    // TODO update background of selected slot
    // selectedSlot.style.backgroundColor = this.colorPicker.color.rgbString;

    // TODO update background for hsv value slider
    // background color as if color had full value (slider background)
    const hsv = {
      h: this.colorPicker.color.hue,
      s: this.colorPicker.color.saturation,
      v: 100,
    };
    const _rgb = iro.Color.hsvToRgb(hsv);
    const sliderBackground = `rgb(${_rgb.r},${_rgb.g},${_rgb.b})`;

    // TODO update hex enter button style on click and after color update
    // document.getElementById('hexcnf')!.style.backgroundColor = 'var(--c-3)';



    // TODO make this work
    /* // if picker, and selected slot's curr color black
    const cd = document.getElementById('csl')!.children;
    const selectedSlot = asHtmlElem(cd[this.selectedColorSlot]);
    if (
      colorInputType === 1 &&
      selectedSlot.style.backgroundColor === 'rgb(0,0,0)'
    ) {
      this.colorPicker.color.setChannel('hsv', 'v', 100);
    }

    // if not hex
    if (colorInputType !== 2) {
      // TODO 0 is placeholder, get white slider value
      this.whites[this.selectedColorSlot] = 0; // parseInt(getInput('sliderW').value);
    }

    // const rgb = this.colorPicker.color.rgb;
    const _newColor = [rgb.r, rgb.g, rgb.b, this.whites[this.selectedColorSlot]];
    const col: Array<number | number[]> = [[], [], []];
    col[this.selectedColorSlot] = _newColor;
    let obj = {
      seg: { col },
    };

    // TODO api call
    // this.requestJson(obj); //*/
  }

  private getDefaults() {
    return {
      rgb: {
        r: DEFAULT_R,
        g: DEFAULT_G,
        b: DEFAULT_B,
      },
      whiteValue: DEFAULT_WHITE_CHANNEL_VALUE,
      hex: '', // TODO default hex value?
      hsvValue: DEFAULT_HSV_VALUE,
      kelvin: DEFAULT_KELVIN,
    };
  }
}
