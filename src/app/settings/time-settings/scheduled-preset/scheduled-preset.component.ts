import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, FormValues, createGetFormControl, getFormControl, getFormControlFn } from 'src/app/shared/form-service';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';
import { SelectItem, ScheduledPreset } from '../../shared/settings-types';
import { UnsubscriberComponent } from 'src/app/shared/unsubscriber/unsubscriber.component';

@Component({
  selector: 'app-scheduled-preset',
  templateUrl: './scheduled-preset.component.html',
  styleUrls: ['./scheduled-preset.component.scss']
})
export class ScheduledPresetComponent extends UnsubscriberComponent implements OnInit {
  @Input() scheduledPreset?: ScheduledPreset;
  scheduledPresetForm!: FormGroup;
  getFormControl!: getFormControlFn;
  
  @HostBinding('class.isEditing')
  isEditing!: boolean;

  @HostListener('click', ['$event.target'])
  onClick(e: Event) {
    if (!this.isEditing) {
      this.isEditing = true;
    }
  }

  daysOfWeek = [
    { label: 'Sun', shortLabel: 'S', formControlName: 'days.sunday' },
    { label: 'Mon', shortLabel: 'M', formControlName: 'days.monday' },
    { label: 'Tue', shortLabel: 'T', formControlName: 'days.tuesday' },
    { label: 'Wed', shortLabel: 'W', formControlName: 'days.wednesday' },
    { label: 'Thu', shortLabel: 'T', formControlName: 'days.thursday' },
    { label: 'Fri', shortLabel: 'F', formControlName: 'days.friday' },
    { label: 'Sat', shortLabel: 'S', formControlName: 'days.saturday' },
  ];

  // TODO copy input configs from wled html
  hourInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.scheduledPresetForm, 'hour'),
    placeholder: '0',
    widthPx: 50,
    min: 0,
    max: 23,
  };

  minuteInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.scheduledPresetForm, 'minute'),
    placeholder: '0',
    widthPx: 50,
    min: 0,
    max: 59,
  };

  presetIdInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.scheduledPresetForm, 'presetId'),
    placeholder: '0',
    widthPx: 50,
  };

  startDateDayInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.scheduledPresetForm, 'startDate.day'),
    placeholder: '0',
    widthPx: 50,
    min: 1,
    max: 31,
  };

  endDateDayInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.scheduledPresetForm, 'endDate.day'),
    placeholder: '0',
    widthPx: 50,
    min: 1,
    max: 31,
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
    super();
  }

  ngOnInit() {
    this.scheduledPresetForm = this.createForm(this.scheduledPreset as unknown as FormValues ?? this.getDefaultFormValues());
    this.getFormControl = createGetFormControl(this.scheduledPresetForm);
    this.isEditing = false;
  }

  minimize(event: Event) {
    event.stopPropagation();
    this.isEditing = false;
  }

  formatTime() {
    const type = this.getFormControl('type')
      ? this.getFormControl('type').value
      : '';
    const minute = this.getFormControl('minute').value;
    const minuteFormatted = `0${minute}`.slice(-2);
    switch (type) {
      case 'sunrise':
        return `Sunrise (minute :${minuteFormatted})`;
      case 'sunset':
        return `Sunset (minute :${minuteFormatted})`;
      default:
        const hour = this.getFormControl('hour').value;
        const hourFormatted = `0${hour}`.slice(-2);
        return `${hourFormatted}:${minuteFormatted}`;
    }
  }

  getDayValues() {
    // TODO cache this for performance?
    return this.daysOfWeek
      .map(({ formControlName, shortLabel }) => {
        const { value } = this.getFormControl(formControlName);
        return {
          label: shortLabel,
          enabled: value,
        };
      });
  }

  formatDateRange() {
    try {
      const startMonth = this.getFormControl('startDate.month').value;
      const startDay = this.getFormControl('startDate.day').value;
      const endMonth = this.getFormControl('endDate.month').value;
      const endDay = this.getFormControl('endDate.day').value;
      const startMonthLabel = this.monthOptions.find(({ value }) => value === startMonth)!.name;
      const endMonthLabel = this.monthOptions.find(({ value }) => value === endMonth)!.name;
      return `${startMonthLabel} ${startDay} - ${endMonthLabel} ${endDay}`
    } catch (e) {
      return 'invalid date range'
    }
  }

  private createForm(formValues = this.getDefaultFormValues()) {
    // TODO which (if any) of these should be required by default?
    const form = this.formService.createFormGroup(formValues);

    this.getValueChanges<boolean>(form, 'enabled')
      .subscribe(value => {
        this.toggleRowEnabled(form);
      });

    return form;
  }

  private getDefaultFormValues(): FormValues {
    const value: ScheduledPreset = {
      enabled: true,
      hour: 0,
      minute: 0,
      presetId: 0,
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
    return value as unknown as FormValues;
  }

  private toggleRowEnabled(scheduledPresetForm: FormGroup) {
    if (scheduledPresetForm) {
      const isEnabled = scheduledPresetForm.get('enabled')!.value;
      if (isEnabled) {
        // enable all
        scheduledPresetForm.get('hour')?.enable({ emitEvent: false });
        scheduledPresetForm.get('minute')?.enable({ emitEvent: false });
        scheduledPresetForm.get('presetId')!.enable({ emitEvent: false });
        scheduledPresetForm.get('days')!.enable({ emitEvent: false });
        scheduledPresetForm.get('startDate')!.enable({ emitEvent: false });
        scheduledPresetForm.get('endDate')!.enable({ emitEvent: false });
      } else {
        // disable all
        scheduledPresetForm.get('hour')?.disable({ emitEvent: false });
        scheduledPresetForm.get('minute')?.disable({ emitEvent: false });
        scheduledPresetForm.get('presetId')!.disable({ emitEvent: false });
        scheduledPresetForm.get('days')!.disable({ emitEvent: false });
        scheduledPresetForm.get('startDate')!.disable({ emitEvent: false });
        scheduledPresetForm.get('endDate')!.disable({ emitEvent: false });
      }
    }
  }
}
