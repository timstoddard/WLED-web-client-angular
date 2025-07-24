import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { createGetFormControl, getFormControlFn } from 'src/app/shared/form-service';

@Component({
  selector: 'app-day-of-week-picker',
  templateUrl: './day-of-week-picker.component.html',
  styleUrls: ['./day-of-week-picker.component.scss']
})
export class DayOfWeekPickerComponent {
  @Input() daysOfWeekForm!: FormGroup;
  @Input() readOnly!: boolean;
  getFormControl!: getFormControlFn;

  daysOfWeek = [
    { label: 'Sun', shortLabel: 'S', formControlName: '0' },
    { label: 'Mon', shortLabel: 'M', formControlName: '1' },
    { label: 'Tue', shortLabel: 'T', formControlName: '2' },
    { label: 'Wed', shortLabel: 'W', formControlName: '3' },
    { label: 'Thu', shortLabel: 'T', formControlName: '4' },
    { label: 'Fri', shortLabel: 'F', formControlName: '5' },
    { label: 'Sat', shortLabel: 'S', formControlName: '6' },
  ];

  ngOnInit() {
    this.getFormControl = createGetFormControl(this.daysOfWeekForm);
  }

  getDayClassModifier(formControlName: string) {
    let result = 'disabled';
    const formControl = this.getFormControl(formControlName);
    if (formControl && formControl.value) {
      result = 'enabled';
    }
    return result;
  }
}
