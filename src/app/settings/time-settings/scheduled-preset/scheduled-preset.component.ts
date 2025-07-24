import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { createGetFormControl, createGetFormGroup, getFormControl, getFormControlFn, getFormGroupFn } from 'src/app/shared/form-service';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';
import { UnsubscriberComponent } from 'src/app/shared/unsubscriber/unsubscriber.component';
import { expandFade } from 'src/app/shared/animations';

@Component({
  selector: 'app-scheduled-preset',
  templateUrl: './scheduled-preset.component.html',
  styleUrls: ['./scheduled-preset.component.scss'],
  animations: [expandFade()],
})
export class ScheduledPresetComponent extends UnsubscriberComponent implements OnInit {
  @Input() scheduledPresetForm!: FormGroup;
  @Input() isSunrise!: boolean;
  @Input() isSunset!: boolean;
  @Input() customDateString!: string;
  getFormControl!: getFormControlFn;
  getFormGroup!: getFormGroupFn;

  @HostBinding('class.isEditing')
  isEditing!: boolean;

  @HostListener('click', ['$event.target'])
  onClick(e: Event) {
    if (!this.isEditing) {
      this.isEditing = true;
    }
  }

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
    // TODO - OG version allows -59 to 59: https://github.com/wled/WLED/blob/929a5a8d801e9db691a2d2da6c74dc80105ce8db/wled00/data/settings_time.htm#L48
    min: 0,
    max: 59,
  };

  presetIdInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.scheduledPresetForm, 'presetId'),
    placeholder: '0',
    widthPx: 50,
    min: 0,
    max: 250,
  };

  monthNames: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  constructor() {
    super();
  }

  ngOnInit() {
    this.getFormControl = createGetFormControl(this.scheduledPresetForm);
    this.getFormGroup = createGetFormGroup(this.scheduledPresetForm);
    this.createFormListeners(this.scheduledPresetForm);
    this.isEditing = this.hasNonDefaultSettings();

    this.getValueChanges(this.scheduledPresetForm).subscribe(() => {
      this.isEditing = this.hasNonDefaultSettings();
    });
  }

  minimize(event: Event) {
    event.stopPropagation();
    this.isEditing = false;
  }

  formatTime() {
    const minute = this.getFormControl('minute').value;
    const minuteFormatted = `0${minute}`.slice(-2);
    const hourControl = this.getFormControl('hour');
    if (hourControl) {
      const hour = this.getFormControl('hour').value;
      const hourFormatted = `0${hour}`.slice(-2);
      return `${hourFormatted}:${minuteFormatted}`;
    } else {
      return `${minute >= 0 ? '+' : '-'}${minute} mins`
    }
  }

  isSunriseOrSunset() {
    return this.isSunrise || this.isSunset;
  }

  formatDateRange() {
    if (this.isSunriseOrSunset()) {
      return '';
    }

    try {
      const {
        startMonth,
        startDay,
        endMonth,
        endDay,
      } = this.getStartEndMonthDay();

      const startMonthLabel = this.monthNames[startMonth];
      const endMonthLabel = this.monthNames[endMonth];
      const result = `${startMonthLabel} ${startDay} - ${endMonthLabel} ${endDay}`;
      return result;
    } catch (e) {
      return 'invalid date range';
    }
  }

  private createFormListeners(scheduledPresetForm: FormGroup) {
    this.getValueChanges<boolean>(scheduledPresetForm, 'enabled')
      .subscribe((value: boolean) => {
        this.setRowEnabled(scheduledPresetForm, value);
      });
  }

  private setRowEnabled(scheduledPresetForm: FormGroup, isEnabled: boolean) {
    if (scheduledPresetForm) {
      if (isEnabled) {
        // enable all
        scheduledPresetForm.get('hour')?.enable({ emitEvent: false });
        scheduledPresetForm.get('minute')?.enable({ emitEvent: false });
        scheduledPresetForm.get('presetId')!.enable({ emitEvent: false });
        scheduledPresetForm.get('days')!.enable({ emitEvent: false });
        if (!this.isSunriseOrSunset()) {
          scheduledPresetForm.get('startDate')!.enable({ emitEvent: false });
          scheduledPresetForm.get('endDate')!.enable({ emitEvent: false });
        }
      } else {
        // disable all
        scheduledPresetForm.get('hour')?.disable({ emitEvent: false });
        scheduledPresetForm.get('minute')?.disable({ emitEvent: false });
        scheduledPresetForm.get('presetId')!.disable({ emitEvent: false });
        scheduledPresetForm.get('days')!.disable({ emitEvent: false });
        if (!this.isSunriseOrSunset()) {
          scheduledPresetForm.get('startDate')!.disable({ emitEvent: false });
          scheduledPresetForm.get('endDate')!.disable({ emitEvent: false });
        }
      }
    }
  }

  private hasNonDefaultSettings() {
    let result = false;
    
    const daysOfWeek = Object.values(this.scheduledPresetForm.get('days')!.value);
    const allDaysEnabled = daysOfWeek.reduce((curr, prev) => curr && prev, true);
    if (!allDaysEnabled) {
      result = true;
    }
    if (this.isSunrise) {
      console.log('SUNRISE', daysOfWeek, daysOfWeek)
    }

    if (!this.isSunriseOrSunset()) {
      const {
        startMonth,
        startDay,
        endMonth,
        endDay,
      } = this.getStartEndMonthDay();
      if (
        // js dates store month as zero indexed
        (startMonth + 1) !== 1
        || startDay !== 1
        || (endMonth + 1) !== 12
        || endDay !== 31
      ) {
        result = true;
      }
    }

    return result;
  }

  private getStartEndMonthDay = () => {
    const startDate = new Date(this.getFormControl('startDate').value);
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();

    const endDate = new Date(this.getFormControl('endDate').value);
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();

    return {
      startMonth,
      startDay,
      endMonth,
      endDay,
    };
  }
}
