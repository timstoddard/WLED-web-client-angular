import { Component, OnInit } from '@angular/core';
import { ColorService } from '../../color.service';

@Component({
  selector: 'app-color-slots',
  templateUrl: './color-slots.component.html',
  styleUrls: ['./color-slots.component.scss']
})
export class ColorSlotsComponent implements OnInit {
  private slotColors = [];

  constructor(private colorService: ColorService) { }

  ngOnInit() {
    // TODO uncomment
    // this.selectSlot(0); // before getting api data
    // this.selectSlot(this.selectedSlot); // after getting api data
  }

  selectSlot(slot: number) {
    this.colorService.selectSlot(slot);
  }

  getButtonClasses(slot: number) {
    const selectedSlot = this.colorService.getSelectedSlot();
    return {
      'slot--selected': slot === selectedSlot,
    };
  }
}
