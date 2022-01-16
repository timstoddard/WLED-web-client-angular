import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ColorService } from '../../color.service';

const DEFAULT_COLOR = '#ffaa00';

@Component({
  selector: 'app-hex-input',
  templateUrl: './hex-input.component.html',
  styleUrls: ['./hex-input.component.scss']
})
export class HexInputComponent implements OnInit {
  @Input() selectedColorSlot!: number;
  // @ViewChild('hexInput', { read: ElementRef }) hexInputElement!: ElementRef<HTMLInputElement>;
  hexInput!: FormControl;
  showHexInput: boolean = true; // TODO what default

  constructor(
    private colorService: ColorService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.hexInput = this.formBuilder.control('');
  }

  hexEnter(e: KeyboardEvent) {
    // TODO update background color of "fromHex()" button
    // document.getElementById('hexcnf')!.style.backgroundColor = 'var(--c-6)';
    
    if (e.key === 'Enter') {
      this.fromHex();
    }
  }

  fromHex() {
    const rawValue = this.hexInput.value
    const value = parseInt(rawValue.substring(6), 16) || 0;
    this.colorService.updateWhiteValue(value);
    try {
      this.colorService.setColorPickerColor(`#${rawValue.substring(0, 6)}`);
    } catch (e) {
      this.colorService.setColorPickerColor(DEFAULT_COLOR);
    }
    this.colorService.setColorByInputType(2);
  }

  tglHex() {
    // TODO update app config, this should set a new state and get the value from there
    this.showHexInput = !this.showHexInput;
  }
}
