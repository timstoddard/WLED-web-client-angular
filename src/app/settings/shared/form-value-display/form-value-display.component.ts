import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

const SPACER_DEFAULT = 2;

@Component({
  selector: 'app-form-value-display',
  templateUrl: './form-value-display.component.html',
  styleUrls: ['./form-value-display.component.scss']
})
export class FormValueDisplayComponent {
  @Input() formGroup!: FormGroup;
  @Input() spacer: number | string = SPACER_DEFAULT;
  @Input() show: boolean = true;
  @Input() isExpanded = false;

  getPrintValue() {
    return this.formGroup
      ? JSON.stringify(this.formGroup.value, null, this.spacer || SPACER_DEFAULT)
      : 'No form provided';
  }
}
