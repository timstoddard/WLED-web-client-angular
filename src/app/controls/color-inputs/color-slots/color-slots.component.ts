import { Component, Input, OnInit } from '@angular/core';
import { ColorService } from '../../color.service';

// TODO get default from somewhere?
const DEFAULT_SLOT = 0;

@Component({
  selector: 'app-color-slots',
  templateUrl: './color-slots.component.html',
  styleUrls: ['./color-slots.component.scss']
})
export class ColorSlotsComponent implements OnInit {
  @Input() selectedColorSlot = DEFAULT_SLOT;

  constructor(private colorService: ColorService) { }

  ngOnInit() {
    this.selectSlot(0); // before getting api data
    this.selectSlot(this.selectedColorSlot); // after getting api data

    // TODO set background of all color slots as black by default
    // const cd = getElementList('csl');
    // for (let i = 0; i < cd.length; i++) {
    //   cd[i].style.backgroundColor = 'rgb(0, 0, 0)';
    // }
  }

  selectSlot(slot: number) {
    this.colorService.selectSlot(slot);
  }
}
