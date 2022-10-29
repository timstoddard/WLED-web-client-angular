import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ColorService } from '../../color.service';

@Component({
  selector: 'app-hex-input',
  templateUrl: './hex-input.component.html',
  styleUrls: ['./hex-input.component.scss']
})
export class HexInputComponent {
  @Input() hexInput!: AbstractControl;

  constructor(private colorService: ColorService) { }
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
}
