import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ColorService } from '../../color.service';

const DEFAULT_COLOR = '#ffaa00';

@Component({
  selector: 'app-hex-input',
  templateUrl: './hex-input.component.html',
  styleUrls: ['./hex-input.component.scss']
})
export class HexInputComponent implements OnInit {
  @Input() whites!: number[];
  @Input() selectedColorSlot!: number;
  @ViewChild('hexInput', { read: ElementRef }) hexInputElement!: ElementRef<HTMLInputElement>;

  constructor(private colorService: ColorService) { }

  ngOnInit() {
  }

  hexEnter(e: KeyboardEvent) {
    document.getElementById('hexcnf')!.style.backgroundColor = 'var(--c-6)';
    if (e.key === 'Enter') {
      this.fromHex();
    }
    // if (e.keyCode === 13) {
    //   this.fromHex();
    // }
  }

  fromHex() {
    // TODO can this logic be cleaned up/condensed?
    const str = this.hexInputElement.nativeElement.value;
    this.whites[this.selectedColorSlot] = parseInt(str.substring(6), 16);
    try {
      this.colorService.setColorPickerColor(`#${str.substring(0, 6)}`);
    } catch (e) {
      this.colorService.setColorPickerColor(DEFAULT_COLOR);
    }
    if (isNaN(this.whites[this.selectedColorSlot])) {
      this.whites[this.selectedColorSlot] = 0;
    }
    this.colorService.setColorByInputType(2);
  }
}
