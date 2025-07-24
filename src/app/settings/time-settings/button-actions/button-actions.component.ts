import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { createGetFormControl, getFormControl, getFormControlFn } from 'src/app/shared/form-service';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';

@Component({
  selector: 'app-button-actions',
  templateUrl: './button-actions.component.html',
  styleUrls: ['./button-actions.component.scss']
})
export class ButtonActionsComponent {
  @Input() buttonActionsForm!: FormGroup;
  @Input() buttonIndex!: number;
  getFormControl!: getFormControlFn;

  shortInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.buttonActionsForm, 'short'),
    placeholder: '0',
    widthPx: 60,
    min: 0,
    max: 250,
  };

  longInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.buttonActionsForm, 'long'),
    placeholder: '0',
    widthPx: 60,
    min: 0,
    max: 250,
  };

  doubleInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.buttonActionsForm, 'double'),
    placeholder: '0',
    widthPx: 60,
    min: 0,
    max: 250,
  };

  ngOnInit() {
    this.getFormControl = createGetFormControl(this.buttonActionsForm);
  }
}
