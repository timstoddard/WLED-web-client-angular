import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ColorService } from '../../color.service';

const DEFAULT_COLOR = '#ffaa00';

@Component({
  selector: 'app-hex-input',
  templateUrl: './hex-input.component.html',
  styleUrls: ['./hex-input.component.scss']
})
export class HexInputComponent implements OnInit {
  @Input() hexInput!: AbstractControl;
  showHexInput: boolean = true;

  constructor(private colorService: ColorService) { }

  ngOnInit() {
  }

  getFormControl() {
    return this.hexInput as FormControl;
  }

  hexEnter(e: KeyboardEvent) {
    // TODO update background color of "fromHex()" button
    // document.getElementById('hexcnf')!.style.backgroundColor = 'var(--c-6)';
    
    if (e.key === 'Enter') {
      this.setHex();
    }
  }

  setHex() {
    const rawValue = this.hexInput.value
    const hex = rawValue.substring(0, 6); // TODO also handle length 3? like css
    const whiteValue = parseInt(rawValue.substring(6), 16) || 0;
    this.colorService.setHex(hex, whiteValue);
  }

  toggleShowHex() {
    // TODO update app config, this should set a new state and get the value from there
    this.showHexInput = !this.showHexInput;
  }
}
