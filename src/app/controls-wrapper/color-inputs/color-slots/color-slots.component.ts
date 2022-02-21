import { Component, OnInit } from '@angular/core';
import { UnsubscribingComponent } from '../../../shared/unsubscribing/unsubscribing.component';
import { ColorService, CurrentColor } from '../../color.service';
import { ColorSlotsService } from './color-slots.service';

// TODO variable number of slots

// TODO look into replacing this component with the multi-color provided by the color picker

@Component({
  selector: 'app-color-slots',
  templateUrl: './color-slots.component.html',
  styleUrls: ['./color-slots.component.scss']
})
export class ColorSlotsComponent extends UnsubscribingComponent implements OnInit {
  constructor(
    private colorService: ColorService,
    private colorSlotsService: ColorSlotsService,
  ) {
    super();
  }

  ngOnInit() {
    this.handleUnsubscribe(this.colorService.getCurrentColorData())
      .subscribe(({ hex, whiteValue }: CurrentColor) => {
        // TODO why does rgb(0,0,0) mess things up
        const hexFormatted = hex.substring(0, 6);
        // console.log(hexFormatted, whiteValue);
        this.colorSlotsService.updateSelectedSlot(hexFormatted, whiteValue);
      });

    // TODO select slot after getting api data (might be different than default?)
    // this.selectSlot(this.selectedSlot); // after getting api data
  }

  selectSlot(slot: number) {
    this.colorSlotsService.selectSlot(slot);
  }

  getSlots() {
    return this.colorSlotsService.getSlots();
  }

  getButtonClasses(slot: number) {
    const isSelected = this.colorSlotsService.isSlotSelected(slot);
    return {
      'colorSlots__slot--selected': isSelected,
    };
  }

  getButtonStyle(slot: number) {
    // TODO keep white value here or just show color?
    const whiteValueScaled = Math.floor(this.colorSlotsService.getWhiteValue(slot) / 2) + 128;
    const backgroundHex = `#${this.colorSlotsService.getColorHex(slot)}${whiteValueScaled.toString(16)}`;
    return {
      background: backgroundHex,
    };
  }
}
