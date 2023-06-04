import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, FormValues, createGetFormControl, getFormControl, getFormControlFn } from 'src/app/shared/form-service';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';
import { SelectItem } from '../../shared/settings-types';

@Component({
  selector: 'app-time-based-preset',
  templateUrl: './time-based-preset.component.html',
  styleUrls: ['./time-based-preset.component.scss']
})
export class TimeBasedPresetComponent {
  timeBasedPresetsForm!: FormGroup;
  getFormControl!: getFormControlFn;

  daysOfWeek = [
    { label: 'Sun', enabled: true, formControlName: 'days.sunday' },
    { label: 'Mon', enabled: true, formControlName: 'days.monday' },
    { label: 'Tue', enabled: true, formControlName: 'days.tuesday' },
    { label: 'Wed', enabled: true, formControlName: 'days.wednesday' },
    { label: 'Thu', enabled: true, formControlName: 'days.thursday' },
    { label: 'Fri', enabled: true, formControlName: 'days.friday' },
    { label: 'Sat', enabled: true, formControlName: 'days.saturday' },
  ];

  // TODO copy input configs from wled html
  hourInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeBasedPresetsForm, 'hour'),
    placeholder: '0',
    widthPx: 50,
  };

  minuteInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeBasedPresetsForm, 'minute'),
    placeholder: '0',
    widthPx: 50,
  };

  presetInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeBasedPresetsForm, 'preset'),
    placeholder: '0',
    widthPx: 50,
  };

  startDateDayInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeBasedPresetsForm, 'startDate.day'),
    placeholder: '0',
    widthPx: 50,
  };

  endDateDayInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeBasedPresetsForm, 'endDate.day'),
    placeholder: '0',
    widthPx: 50,
  };

  monthOptions: SelectItem<number>[] = [
    {
      name: 'Jan',
      value: 1,
    },
    {
      name: 'Feb',
      value: 2,
    },
    {
      name: 'Mar',
      value: 3,
    },
    {
      name: 'Apr',
      value: 4,
    },
    {
      name: 'May',
      value: 5,
    },
    {
      name: 'Jun',
      value: 6,
    },
    {
      name: 'Jul',
      value: 7,
    },
    {
      name: 'Aug',
      value: 8,
    },
    {
      name: 'Sep',
      value: 9,
    },
    {
      name: 'Oct',
      value: 10,
    },
    {
      name: 'Nov',
      value: 11,
    },
    {
      name: 'Dec',
      value: 12,
    },
  ];

  constructor(
    private formService: FormService,
  ) {

  }

  ngOnInit() {
    this.timeBasedPresetsForm = this.createForm();
    this.getFormControl = createGetFormControl(this.timeBasedPresetsForm);
  }

  private createForm() {
    // TODO which (if any) of these should be required by default?
    const form = this.formService.createFormGroup(this.getDefaultFormValues());
    // form.get('settingsPin')!.addValidators([
    //   Validators.pattern(/[0-9]*/),
    // ]);
    // form.get('otaUpdatePassword')!.addValidators([
    //   Validators.minLength(0),
    //   Validators.maxLength(32),
    // ]);
    return form;
  }

  private getDefaultFormValues(): FormValues {
    return {
      enabled: true,
      hour: 0,
      minute: 0,
      preset: 0,
      days: {
        sunday: true,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
      },
      startDate: {
        month: 1,
        day: 1,
      },
      endDate: {
        month: 12,
        day: 31,
      },
    };
  }
}
