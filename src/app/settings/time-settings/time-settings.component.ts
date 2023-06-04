import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormService, FormValues, createGetFormControl, getFormControlFn } from '../../shared/form-service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { SelectItem } from '../shared/settings-types';
import { TimeSettingsService } from './time-settings.service';

enum ScheduledPresetType {
  TIME = 'TIME',
  SUNRISE = 'SUNRISE',
  SUNSET = 'SUNSET',
}

@Component({
  selector: 'app-time-settings',
  templateUrl: './time-settings.component.html',
  styleUrls: ['./time-settings.component.scss']
})
export class TimeSettingsComponent extends UnsubscriberComponent implements OnInit {
  timeSettingsForm!: FormGroup;

  // TODO move select option lists like this into shared
  // file `select-option-lists.ts`.
  // maybe some lists can be reused across components
  // or can create some nifty helper functions.
  // also would store the `SelectItem` interface.
  timeZoneOptions: SelectItem<number>[] = [
    {
      name: 'GMT(UTC)',
      value: 0,
    },
    {
      name: 'GMT/BST',
      value: 1,
    },
    {
      name: 'CET/CEST',
      value: 2,
    },
    {
      name: 'EET/EEST',
      value: 3,
    },
    {
      name: 'US-EST/EDT',
      value: 4,
    },
    {
      name: 'US-CST/CDT',
      value: 5,
    },
    {
      name: 'US-MST/MDT',
      value: 6,
    },
    {
      name: 'US-AZ',
      value: 7,
    },
    {
      name: 'US-PST/PDT',
      value: 8,
    },
    {
      name: 'CST(AWST)',
      value: 9,
    },
    {
      name: 'JST(KST)',
      value: 10,
    },
    {
      name: 'AEST/AEDT',
      value: 11,
    },
    {
      name: 'NZST/NZDT',
      value: 12,
    },
    {
      name: 'North Korea',
      value: 13,
    },
    {
      name: 'IST (India)',
      value: 14,
    },
    {
      name: 'CA-Saskatchewan',
      value: 15,
    },
    {
      name: 'ACST',
      value: 16,
    },
    {
      name: 'ACST/ACDT',
      value: 17,
    },
    {
      name: 'HST (Hawaii)',
      value: 18,
    },
    {
      name: 'NOVT (Novosibirsk)',
      value: 19,
    },
    {
      name: 'AKST/AKDT (Anchorage)',
      value: 20,
    },
    {
      name: 'MX-CST/CDT',
      value: 21,
    },
  ];

  clockOverlayOptions: SelectItem<string>[] = [
    // gId("cac").style.display="none";
		// gId("coc").style.display="block";
		// gId("ccc").style.display="none";
		// if (gId("ca").selected) {
		// 	gId("cac").style.display="block";
		// }
		// if (gId("cc").selected) {
		// 	gId("coc").style.display="none";
		// 	gId("ccc").style.display="block";
		// }
		// if (gId("cn").selected) {
		// 	gId("coc").style.display="none";
		// }
    {
      name: 'None',
      value: '',
    },
    {
      name: 'Analog Clock',
      value: '',
    },
    {
      name: 'Single Digit Clock',
      value: '',
    },
    {
      name: 'Cronixie Clock',
      value: '',
    },
  ];

  scheduledPresetsHeaders = [
    'Active',
    'Hour/Minute',
    'Preset',
    'Days',
  ];

  weekdays = [
    {
      name: 'sunday',
      abbreviated: 'Sun',
    },
    {
      name: 'monday',
      abbreviated: 'Mon',
    },
    {
      name: 'tuesday',
      abbreviated: 'Tue',
    },
    {
      name: 'wednesday',
      abbreviated: 'Wed',
    },
    {
      name: 'thursday',
      abbreviated: 'Thu',
    },
    {
      name: 'friday',
      abbreviated: 'Fri',
    },
    {
      name: 'saturday',
      abbreviated: 'Sat',
    },
  ];
  getFormControl!: getFormControlFn;

  constructor(
    private formService: FormService,
    private timeSettingsService: TimeSettingsService,
  ) {
    super();
  }

  ngOnInit() {
    this.timeSettingsForm = this.createForm();
    this.getFormControl = createGetFormControl(this.timeSettingsForm);

    this.handleUnsubscribe(
      this.timeSettingsService.getParsedValues()
    ).subscribe(({ formValues, metadata }) => {
      console.log(' >>> TIME formValues', formValues)
      console.log(' >>> TIME metadata', metadata)
      this.timeSettingsForm.patchValue(formValues);
    });
  }

  submitForm() {
    // TODO
  }

  get scheduledPresets() {
    return this.timeSettingsForm.get('scheduledPresets') as FormArray;
  }

  getDaysByIndex(index: number) {
    const { value } = this.scheduledPresets.at(index).get('days')!;
    return value;
  }

  /**
   * The multi-button toggle group doesn't support form controls for
   * the individual buttons so I had to implement the functionality manually.
   * @param day 
   * @param index 
   * @param days 
   */
  toggleDayByIndex(day: string, index: number) {
    const days = this.getDaysByIndex(index);
    const previousValue = days[day];
    const newDays = {
      ...days,
      [day]: !previousValue,
    };
    this.scheduledPresets
      .at(index)
      .get('days')!
      .patchValue(newDays);
  }

  private createForm() {
    return this.formService.createFormGroup(this.getDefaultFormValues(), {
      scheduledPresets: this.createScheduledPresetsForm(),
    });
  }

  private getDefaultFormValues(): FormValues {
    return {
      ntp: {
        enable: false,
        ntpServer: '0.wled.pool.ntp.org',
      },
      use24HourTime: true,
      timeZone: 0,
      utcOffsetSeconds: 0,
      geoCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      clock: {
        overlay: '',
        isCountdown: false,
        countdownEnd: {
          year: 2022,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: 0,
        },
      },
      macroPresets: {
        alexaOn: 0,
        alexaOff: 0,
        buttonShortPress: 0,
        buttonLongPress: 0,
        buttonDoublePress: 0,
        countdownEnd: 0,
        timerEnd: 0,
      },
    };
  }

  private createScheduledPresetsForm() {
    return this.formService.formBuilder.array([
      this.createScheduledPresetFormGroup(),
      this.createScheduledPresetFormGroup(),
      this.createScheduledPresetFormGroup(),
      this.createScheduledPresetFormGroup(),
      this.createScheduledPresetFormGroup(ScheduledPresetType.SUNRISE),
      this.createScheduledPresetFormGroup(ScheduledPresetType.SUNSET),
    ]);
  }

  private createScheduledPresetFormGroup(type = ScheduledPresetType.TIME) {
    const days: { [key: string]: boolean } = {}
    for (const day of this.weekdays) {
      days[day.name] = true;
    }
    let customValues: FormValues = {}
    switch (type) {
      case ScheduledPresetType.TIME:
        customValues = {
          hour: 0,
          minute: 0,
        };
        break;
      case ScheduledPresetType.SUNRISE:
        customValues = {
          sunrise: true,
        };
        break;
      case ScheduledPresetType.SUNSET:
        customValues = {
          sunset: true,
        };
        break;
      }
      const defaultValues: FormValues = {
        enabled: true,
        type,
        presetId: 0,
        days,
        ...customValues,
      };
    const formGroup = this.formService.createFormGroup(defaultValues);

    this.getValueChanges<boolean>(formGroup, 'enabled')
      .subscribe(value => {
        this.toggleRowEnabled(formGroup);
      });
    // initialize disabled status for this row
    this.toggleRowEnabled(formGroup);
    
    return formGroup;
  }

  private toggleRowEnabled(rowGroup: FormGroup) {
    if (rowGroup) {
      const isEnabled = rowGroup.get('enabled')!.value;
      if (isEnabled) {
        // enable all
        rowGroup.get('hour')?.enable({ emitEvent: false });
        rowGroup.get('minute')?.enable({ emitEvent: false });
        rowGroup.get('presetId')!.enable({ emitEvent: false });
        rowGroup.get('days')!.enable({ emitEvent: false });
      } else {
        // disable all
        rowGroup.get('hour')?.enable({ emitEvent: false });
        rowGroup.get('minute')?.enable({ emitEvent: false });
        rowGroup.get('presetId')!.disable({ emitEvent: false });
        rowGroup.get('days')!.disable({ emitEvent: false });
      }
    }
  }
}
