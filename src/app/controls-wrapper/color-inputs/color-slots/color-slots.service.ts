import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColorService } from '../../color.service';
import { ControlsServicesModule } from '../../controls-services.module';

const DEFAULT_SLOT_COUNT = 3;
const DEFAULT_SLOT = 0;
const DEFAULT_SLOT_COLORS = [
  'ffffff',
  'ffffff',
  'ffffff',
];
const DEFAULT_WHITE_VALUES = [0, 0, 0];

@Injectable({ providedIn: ControlsServicesModule })
export class ColorSlotsService {
  private selectedColor$: BehaviorSubject<string>;
  private slots: number[] = [];
  private selectedSlot = DEFAULT_SLOT;
  private slotColors = DEFAULT_SLOT_COLORS;
  private whiteValues = DEFAULT_WHITE_VALUES;

  constructor(private colorService: ColorService) {
    this.selectedColor$ = new BehaviorSubject<string>('');

    // TODO initialize colors with WledSegment.col from api response
    const slots = [];
    for (let i = 0; i < DEFAULT_SLOT_COUNT; i++) {
      slots[i] = i;
    }
    this.slots = slots;
  }

  /**
   * Selects a color slot.
   * @param slot 0, 1, or 2
   */
  selectSlot(slot: number) {
    this.selectedSlot = slot;

    const hex = this.slotColors[this.selectedSlot];
    const whiteValue = this.whiteValues[this.selectedSlot];
    // console.log('loading slot', slot + 1, hex, whiteValue)
    this.colorService.setHex(hex, whiteValue);

    // TODO is this needed?
    // force slider update on initial load (picker "color:change" not fired if black)
    // if (this.colorService.getColorPicker().color.value === 0) {
    //   this.colorService.emitNewColor();
    // }
  }

  updateSelectedSlot(hex: string, whiteValue: number) {
    this.slotColors[this.selectedSlot] = hex;
    this.whiteValues[this.selectedSlot] = whiteValue;
    this.selectedColor$.next(hex);
  }

  isSlotSelected(slot: number) {
    return slot === this.selectedSlot;
  }

  getSlots() {
    return this.slots;
  }

  getWhiteValue(slot: number) {
    return this.whiteValues[slot];
  }

  getColorHex(slot: number) {
    return this.slotColors[slot];
  }

  // TODO create util function for hex->rgb & vice versa? or use an existing lib?
  getColorRgb(slot: number) {
    // TODO assumes hex is length 6, is this always the case?
    const hex = this.slotColors[slot];
    const rgb = {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
    return rgb;
  }

  getSelectedColor() {
    return this.selectedColor$;
  }
}
