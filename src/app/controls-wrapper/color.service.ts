import { Injectable } from '@angular/core';
import { IroColorValue, RgbColor } from '@irojs/iro-core';
import iro from '@jaames/iro';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { AppStateService } from '../shared/app-state/app-state.service';
import { AppLedInfo } from '../shared/app-types';
import { PostResponseHandler } from '../shared/post-response-handler';
import { UnsubscriberService } from '../shared/unsubscribing/unsubscriber.service';
import { ControlsServicesModule } from './controls-services.module';

export interface CurrentColor {
  rgb: RgbColor;
  whiteChannel: number;
  hex: string; // 6 or 8 characters long
  hsvValue: number;
  kelvin: number;
}

const DEFAULT_RGB = {
  r: 255,
  g: 255,
  b: 255,
};
const DEFAULT_WHITE_CHANNEL = 255;

@Injectable({ providedIn: ControlsServicesModule })
export class ColorService extends UnsubscriberService {
  private _colorPicker!: iro.ColorPicker;
  private currentColorData$: BehaviorSubject<CurrentColor>;
  private hasWhiteChannel!: boolean; // TODO use this somehow?
  // white channel value, if rbgw enabled
  private whiteChannel!: number;
  private selectedSlot!: number;

  constructor(
    private appStateService: AppStateService,
    private apiService: ApiService,
    private postResponseHandler: PostResponseHandler,
  ) {
    super();

    // TODO better way/place to set this?
    this.selectedSlot = 0;

    this.currentColorData$ = new BehaviorSubject<CurrentColor>(this.getDefaults());

    this.appStateService.getLedInfo(this.ngUnsubscribe)
      .subscribe(({ hasWhiteChannel }: AppLedInfo) => {
        this.hasWhiteChannel = hasWhiteChannel;
        this.whiteChannel = DEFAULT_WHITE_CHANNEL;
      });
  }

  getCurrentColorData() {
    return this.currentColorData$;
  }

  get colorPicker() {
    return this._colorPicker;
  }

  setColorPicker(colorPicker: iro.ColorPicker) {
    if (this._colorPicker) {
      // clean up old picker, if it exists
      this._colorPicker.off('color:change', this.emitNewColor);
    }

    // set up new picker
    this._colorPicker = colorPicker;
    this._colorPicker.on('color:change', this.emitNewColor);
    this.setColorPickerColor(DEFAULT_RGB);
  }

  setColorPickerColor(color: IroColorValue) {
    const newColor = new iro.Color(color);
    if (newColor.value > 0) {
      this._colorPicker.color.set(newColor);
    } else {
      this._colorPicker.color.setChannel('hsv', 'v', 0);
    }
  }

  setHsvValue = (hsvValue: number) => {
    // TODO when this is 0 (or DNE?), use kelvin
    this._colorPicker.color.setChannel('hsv', 'v', hsvValue);
  }

  setKelvin = (kelvin: number) => {
    this._colorPicker.color.set({ kelvin });
  }

  setRgb = (r: number, g: number, b: number) => {
    const rgb = `rgb(${r},${g},${b})`;
    this.setColorPickerColor(rgb);
  }

  setWhiteChannel = (whiteChannel: number) => {
    if (whiteChannel !== this.whiteChannel) {
      this.whiteChannel = whiteChannel;
      this._colorPicker?.emit('color:change');
    }
  }

  setWhiteBalance = (whiteBalance: number) => {
    const result = this.apiService.setWhiteBalance(whiteBalance);
    if (result) {
      this.handleUnsubscribe(result)
        .subscribe(this.postResponseHandler.handleFullJsonResponse());
    }
  }

  setHex(hex: string, whiteChannel: number) {
    // TODO what if white channel is in hex string?
    this.whiteChannel = whiteChannel;
    try {
      this.setColorPickerColor(`#${hex}`);
    } catch (e) {
      console.log(e)
      // TODO show error toast
      // this.setColorPickerColor(DEFAULT_COLOR);
    }
  }

  /**
   * Updates various color input sliders.
   */
  emitNewColor = () => {
    const {
      rgb,
      kelvin,
      value: hsvValue,
    } = this._colorPicker.color;
    let hexString = this._colorPicker.color.hexString.substring(1);
    const hex = this.whiteChannel > 0
      ? hexString + this.whiteChannel.toString(16) // TODO pad with zeroes?
      : hexString;
    const newColor: CurrentColor = {
      rgb,
      whiteChannel: this.whiteChannel,
      hex,
      hsvValue,
      kelvin,
    };
    this.currentColorData$.next(newColor);

    // TODO default hsv value for empty slot should be 100
    // this.colorPicker.color.setChannel('hsv', 'v', 100);

    const result = this.apiService.setColor(
      rgb.r,
      rgb.g,
      rgb.b,
      this.whiteChannel,
      this.selectedSlot);

    if (result) {
      this.handleUnsubscribe(result)
        .subscribe(this.postResponseHandler.handleFullJsonResponse());
    }
  }

  setSlot(slot: number) {
    this.selectedSlot = slot;
  }

  private getDefaults(): CurrentColor {
    return {
      rgb: {
        r: 0,
        g: 0,
        b: 0,
      },
      whiteChannel: 0,
      hex: '',
      hsvValue: 0,
      kelvin: 0,
    };
  }
}
