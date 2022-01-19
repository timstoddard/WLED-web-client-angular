import { Injectable } from '@angular/core';
import { IroColorValue, RgbColor } from '@irojs/iro-core';
import iro from '@jaames/iro';
import { BehaviorSubject } from 'rxjs';
import { ApiHttpService } from '../shared/api-http.service';
import { ControlsModule } from './controls.module';

export interface CurrentColor {
  rgb: RgbColor;
  whiteValue: number;
  hex: string; // 6 or 8 characters long
  hsvValue: number;
  kelvin: number;
}

const DEFAULT_WHITE_CHANNEL_VALUE = 128;
const DEFAULT_WHITE_BALANCE = 128; // TODO use this
const DEFAULT_R = 128;
const DEFAULT_G = 128;
const DEFAULT_B = 128;
const DEFAULT_HSV_VALUE = 128;
const DEFAULT_KELVIN = 6550;
const DEFAULT_WHITE_VALUE = 128;

// TODO should be able to provide in controls module
// @Injectable({ providedIn: ControlsModule })
@Injectable({ providedIn: 'root' })
export class ColorService {
  private colorPicker!: iro.ColorPicker;
  // white value, if rbgw enabled
  private whiteValue = DEFAULT_WHITE_VALUE;
  private currentColorData = new BehaviorSubject<CurrentColor>(this.getDefaults());

  constructor(private apiHttp: ApiHttpService) {}

  getCurrentColorData() {
    return this.currentColorData;
  }

  getColorPicker() {
    return this.colorPicker;
  }

  setColorPicker(colorPicker: iro.ColorPicker) {
    // TODO uncommenting this causes callback to fire multiple times
    // colorPicker.on('input:end', () => {
    //   this.emitNewColor();
    // });
    colorPicker.on('color:change', () => {
      console.log('color change event')
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

  setWhiteValue(whiteValue: number, emit = true) {
    const oldWhiteValue = this.whiteValue;
    this.whiteValue = whiteValue;
    if (emit && this.whiteValue !== oldWhiteValue) {
      this.colorPicker.emit('color:change');
    }
  }

  setWhiteBalance(whiteBalance: number) {
    // TODO save white balance (update color picker?)

    // TODO api call
    // var obj = { "seg": { "cct": parseInt(b) } };
    // requestJson(obj);
  }

  setHex(hex: string, whiteValue: number) {
    this.setWhiteValue(whiteValue, false);
    try {
      this.setColorPickerColor(`#${hex}`);
    } catch (e) {
      console.log(e)
      // TODO alert message instead?
      // this.setColorPickerColor(DEFAULT_COLOR);
    }
  }

  /**
   * Updates various color input sliders.
   */
  emitNewColor() {
    const rgb = this.colorPicker.color.rgb;
    const kelvin = this.colorPicker.color.kelvin;
    const hsvValue = this.colorPicker.color.value;
    const whiteValue = this.whiteValue;
    let hexString = this.colorPicker.color.hexString.substring(1);
    const hex = whiteValue > 0
      ? hexString + whiteValue.toString(16) // TODO pad with zeroes?
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

    // TODO render palettes (need to subscribe)
    // this.redrawPalPrev();



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
