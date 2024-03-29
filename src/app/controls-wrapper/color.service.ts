import { Injectable } from '@angular/core';
import { IroColorValue, RgbColor } from '@irojs/iro-core';
import iro from '@jaames/iro';
import { Subject } from 'rxjs';
import { AppStateService } from '../shared/app-state/app-state.service';
import { UnsubscriberService } from '../shared/unsubscriber/unsubscriber.service';
import { SegmentApiService } from '../shared/api-service/segment-api.service';

export interface CurrentColor {
  rgb: RgbColor;
  whiteChannel: number;
  hex: string; // 6 or 8 characters long
  hsvValue: number;
  kelvin: number;
}

@Injectable()
export class ColorService extends UnsubscriberService {
  private _colorPicker!: iro.ColorPicker;
  private currentColorData$: Subject<CurrentColor>;
  private hasWhiteChannel!: boolean; // TODO use this somehow?
  // white channel value, if rbgw enabled
  private whiteChannel!: number;
  private selectedSlot!: number;

  constructor(
    private appStateService: AppStateService,
    private segmentApiService: SegmentApiService,
  ) {
    super();

    // TODO better way/place to set this?
    this.selectedSlot = 0;

    this.currentColorData$ = new Subject();
    this.whiteChannel = 0;

    this.appStateService.getInfo(this.ngUnsubscribe)
      .subscribe(({ ledInfo }) => {
        const { lightCapabilities } = ledInfo;
        // TODO wire this up
        // this.hasWhiteChannel = hasWhiteChannel;
      });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._colorPicker?.off('color:change', this.emitNewColor);
  }

  getCurrentColorData() {
    return this.currentColorData$;
  }

  get colorPicker() {
    return this._colorPicker;
  }

  setColorPicker(colorPicker: iro.ColorPicker) {
    // clean up old picker, if it exists
    this._colorPicker?.off('color:change', this.emitNewColor);

    // set up new picker
    this._colorPicker = colorPicker;
    this._colorPicker.on('color:change', this.emitNewColor);
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
    this.setColorPickerColor({ kelvin });
  }

  setRgb = (r: number, g: number, b: number) => {
    this.setColorPickerColor({ r, g, b });
  }

  setRgbw = (r: number, g: number, b: number, w: number) => {
    this.setWhiteChannel(w, false);
    this.setColorPickerColor({ r, g, b });
  }

  setWhiteChannel = (whiteChannel: number, shouldCallApi = true) => {
    if (whiteChannel !== this.whiteChannel) {
      this.whiteChannel = whiteChannel;
      if (shouldCallApi) {
        this._colorPicker.emit('color:change');
      }
    }
  }

  setWhiteBalance = (whiteBalance: number) => {
    this.handleUnsubscribe(this.segmentApiService.setWhiteBalance(whiteBalance))
      .subscribe();
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

    this.handleUnsubscribe(
      this.segmentApiService.setColor(
        rgb.r,
        rgb.g,
        rgb.b,
        this.whiteChannel,
        this.selectedSlot)
    )
      .subscribe();
  }

  // TODO evaluate combinbing ColorService & ColorSlotsService
  // (because ColorService needs to know the slot, seems useful to just have that logic combined here)
  setSlot(slot: number) {
    this.selectedSlot = slot;
  }
}
