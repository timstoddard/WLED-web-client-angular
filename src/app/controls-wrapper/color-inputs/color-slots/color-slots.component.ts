import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { UnsubscribingComponent } from '../../../shared/unsubscribing.component';
import { ColorService, CurrentColor } from '../../color.service';

// TODO variable number of slots

// TODO look into replacing this component with the multi-color provided by the color picker

const DEFAULT_SLOT = 0;
const DEFAULT_SLOT_COLORS = [
  'ffffff',
  'ffffff',
  'ffffff',
];
const DEFAULT_WHITE_VALUES = [0, 0, 0];

@Component({
  selector: 'app-color-slots',
  templateUrl: './color-slots.component.html',
  styleUrls: ['./color-slots.component.scss']
})
export class ColorSlotsComponent extends UnsubscribingComponent implements OnInit {
  private selectedSlot = DEFAULT_SLOT;
  private slotColors = DEFAULT_SLOT_COLORS;
  private whiteValues = DEFAULT_WHITE_VALUES;

  constructor(private colorService: ColorService) {
    super();
  }

  ngOnInit() {
    // TODO listen to color changes, update current slot
    this.colorService.getCurrentColorData()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({ hex, whiteValue }: CurrentColor) => {
        const hexFormatted = hex.substring(0, 6);
        // console.log(hexFormatted, whiteValue);
        this.updateSelectedSlot(hexFormatted, whiteValue);
      });

    // TODO still needed?
    // this.selectSlot(0); // before getting api data
    // this.selectSlot(this.selectedSlot); // after getting api data
  }

  updateSelectedSlot(hex: string, whiteValue: number) {
    this.slotColors[this.selectedSlot] = hex;
    this.whiteValues[this.selectedSlot] = whiteValue;
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

  getSlots() {
    return [0, 1, 2];
  }

  getButtonClasses(slot: number) {
    return {
      'colorSlots__slot--selected': slot === this.selectedSlot,
    };
  }

  getButtonStyle(slot: number) {
    // TODO keep white value here or just show color?
    const whiteValueScaled = Math.floor(this.whiteValues[slot] / 2) + 128;
    const backgroundHex = `#${this.slotColors[slot]}${whiteValueScaled.toString(16)}`;
    return {
      background: backgroundHex,
    };
  }
}
