import { Component, Input, OnInit } from '@angular/core';
import { ColorService } from '../../color.service';

// TODO get default from somewhere?
const DEFAULT_SLOT = 0;
const DEFAULT_SLOT_COLORS = [
  'rgb(0,0,0)',
  'rgb(0,0,0)',
  'rgb(0,0,0)',
]

@Component({
  selector: 'app-color-slots',
  templateUrl: './color-slots.component.html',
  styleUrls: ['./color-slots.component.scss']
})
export class ColorSlotsComponent implements OnInit {
  private selectedSlot = DEFAULT_SLOT;
  private slotColors = [];

  constructor(private colorService: ColorService) { }

  ngOnInit() {
    // TODO uncomment
    // this.selectSlot(0); // before getting api data
    // this.selectSlot(this.selectedSlot); // after getting api data
  }

  selectSlot(slot: number) {
    this.selectedSlot = slot;
    this.colorService.selectSlot(this.selectedSlot);
  }

  getButtonClasses(slot: number) {
    return {
      'slot--selected': slot === this.selectedSlot,
    };
  }
}
