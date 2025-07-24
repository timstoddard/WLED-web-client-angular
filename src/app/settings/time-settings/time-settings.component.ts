import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormService, FormValues, createGetFormArray, createGetFormControl, getFormArrayFn, getFormControl, getFormControlFn } from '../../shared/form-service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { ButtonAction, ScheduledPreset, SelectItem, SunriseSunsetScheduledPreset, TimeSettings } from '../shared/settings-types';
import { TimeSettingsService } from './time-settings.service';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';
import { Router } from '@angular/router';
import { expandFade } from 'src/app/shared/animations';
import { SnackbarService } from 'src/app/shared/snackbar.service';

const DEFAULT_SUNRISE_SUNSET_PRESET = {
  enabled: true,
  presetId: 0,
  minute: 0,
  days: {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  },
};

@Component({
  selector: 'app-time-settings',
  templateUrl: './time-settings.component.html',
  styleUrls: ['./time-settings.component.scss'],
  animations: [expandFade()],
})
export class TimeSettingsComponent extends UnsubscriberComponent implements OnInit {
  timeSettingsForm!: FormGroup;
  getFormControl!: getFormControlFn;
  getFormArray!: getFormArrayFn;

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
    {
      name: 'PKT (Pakistan)',
      value: 22,
    },
  ];

  // TODO - not currently used, check with WLED
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

  weekdays: SelectItem<string>[] = [
    {
      name: 'Sun',
      value: 'sunday',
    },
    {
      name: 'Mon',
      value: 'monday',
    },
    {
      name: 'Tue',
      value: 'tuesday',
    },
    {
      name: 'Wed',
      value: 'wednesday',
    },
    {
      name: 'Thu',
      value: 'thursday',
    },
    {
      name: 'Fri',
      value: 'friday',
    },
    {
      name: 'Sat',
      value: 'saturday',
    },
  ];

  ntpServerUrlInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'ntpServer.url'),
    placeholder: '0.wled.pool.ntp.org',
    widthPx: 200,
  };

  utcOffsetInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'utcOffsetSeconds'),
    placeholder: '0',
    widthPx: 100,
  };

  latitudeInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'coordinates.latitude'),
    placeholder: '0.0',
    widthPx: 100,
    // note, WLED app sets max of 66.6
    max: 90,
    min: -90,
    step: 0.01,
  };

  longitudeInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'coordinates.longitude'),
    placeholder: '0.0',
    widthPx: 100,
    max: 180,
    min: -180,
    step: 0.01,
  };

  firstLedInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'analogClockOverlay.firstLed'),
    placeholder: '0',
    widthPx: 80,
    min: 0,
  };

  lastLedInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'analogClockOverlay.lastLed'),
    placeholder: '0',
    widthPx: 80,
    min: 0,
  };

  middleLedInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'analogClockOverlay.middleLed'),
    placeholder: '0',
    widthPx: 80,
    min: 0,
  };

  countdownYearInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'countdown.year'),
    placeholder: '2025',
    widthPx: 80,
  };

  countdownMonthInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'countdown.month'),
    placeholder: '0',
    widthPx: 50,
    min: 1,
    max: 12,
  };

  countdownDayInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'countdown.day'),
    placeholder: '0',
    widthPx: 50,
    min: 1,
    max: 31,
  };

  countdownHourInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'countdown.hour'),
    placeholder: '0',
    widthPx: 50,
    min: 0,
    max: 23,
  };

  countdownMinuteInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'countdown.minute'),
    placeholder: '0',
    widthPx: 50,
    min: 0,
    max: 59,
  };

  countdownSecondInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'countdown.second'),
    placeholder: '0',
    widthPx: 50,
    min: 0,
    max: 59,
  };

  alexaOnInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'presets.alexaOn'),
    placeholder: '0',
    widthPx: 100,
  };

  alexaOffInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'presets.alexaOff'),
    placeholder: '0',
    widthPx: 100,
  };

  countdownEndInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'presets.countdownEnd'),
    placeholder: '0',
    widthPx: 100,
  };

  timerEndInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.timeSettingsForm, 'presets.timerEnd'),
    placeholder: '0',
    widthPx: 100,
  };

  pageLoadLocalTime: string;
  hasCurrentLatLong: boolean;

  constructor(
    private formService: FormService,
    private timeSettingsService: TimeSettingsService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {
    super();
    this.pageLoadLocalTime = 'loading...';
    this.hasCurrentLatLong = false;
  }

  ngOnInit() {
    this.timeSettingsForm = this.createForm();
    this.getFormControl = createGetFormControl(this.timeSettingsForm);
    this.getFormArray = createGetFormArray(this.timeSettingsForm);

    this.handleUnsubscribe(
      this.timeSettingsService.getParsedValues()
    ).subscribe(({ formValues, metadata, methodCalls }) => {
      console.log(' >>> TIME formValues', formValues)
      console.log(' >>> TIME metadata', metadata)
      if (metadata['pageLoadLocalTime']) {
        this.pageLoadLocalTime = new Date(metadata['pageLoadLocalTime'] as string).toString();
      }

      // update form value
      this.timeSettingsForm.patchValue(formValues);

      // update scheduled presets
      const scheduledPresets = formValues['scheduledPresets'] as ScheduledPreset[];
      const sunrisePreset = {...(formValues['sunrisePreset'] as SunriseSunsetScheduledPreset)};
      const sunsetPreset = {...(formValues['sunsetPreset'] as SunriseSunsetScheduledPreset)};

      this.timeSettingsForm.removeControl('scheduledPresets');
      this.timeSettingsForm.addControl('scheduledPresets', this.formService.createFormArray(scheduledPresets));

      if (sunrisePreset && Object.keys(sunrisePreset).length > 0) {
        this.sunrisePreset.setValue(sunrisePreset);
      }
      if (sunsetPreset && Object.keys(sunsetPreset).length > 0) {
        this.sunsetPreset.setValue(sunsetPreset);
      }

      // update button actions
      const buttonActions = formValues['buttonActions'] as ButtonAction[];
      this.timeSettingsForm.removeControl('buttonActions');
      this.timeSettingsForm.addControl('buttonActions', this.formService.createFormArray(buttonActions));

      this.changeDetectorRef.markForCheck();
    });
  }

  override ngOnDestroy(): void {
    // TODO window removeEventListener 'message'
    super.ngOnDestroy();
  }

  submitForm() {
    const formValue = this.timeSettingsForm.getRawValue() as TimeSettings;
    this.handleUnsubscribe(
      this.timeSettingsService.setTimeSettings(formValue)
    ).subscribe((responseHTML: string) => {
      const expectedText = 'Time settings saved.';
      const snackbarMessage = responseHTML.includes(expectedText)
        ? 'Time settings were updated successfully.'
        : 'Error: Time settings were NOT updated.';
      this.snackbarService.openSnackBar(snackbarMessage);
    });
    
    // TODO should this be conditional?
    // this.router.navigate(['controls']);
  }

  get buttonActions() {
    return this.timeSettingsForm.get('buttonActions') as FormArray<FormGroup>;
  }

  get scheduledPresets() {
    return this.timeSettingsForm.get('scheduledPresets') as FormArray<FormGroup>;
  }

  get sunrisePreset() {
    return this.timeSettingsForm.get('sunrisePreset') as FormGroup;
  }

  get sunsetPreset() {
    return this.timeSettingsForm.get('sunsetPreset') as FormGroup;
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

  isAnalogOverlayEnabled() {
    return this.getFormControl('analogClockOverlay.enabled').value;
  }

  isCountdownEnabled() {
    return this.getFormControl('countdown.enabled').value;
  }

  getLatLong() {
    // TODO the locator website currently fails, even with permission

    if (!this.hasCurrentLatLong) {
			window.addEventListener('message', (event) => {
				if (event.origin !== 'https://locate.wled.me') return;
				if (event.data instanceof Object) {
          console.log('LAT LONG', event.data)
          this.getFormControl('coordinates.latitude').setValue(event.data.lat as number);
          this.getFormControl('coordinates.longitude').setValue(event.data.lon as number);
				}
			}, false);
			this.hasCurrentLatLong = true;
		}
		window.open('https://locate.wled.me', '_blank');
  }

  private createForm() {
    return this.formService.createFormGroup(this.getDefaultFormValues());
  }

  private getDefaultFormValues(): FormValues {
    const MS_IN_HOUR = 60 * 60 * 1000;
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setTime(now.getTime() + (1 * MS_IN_HOUR));
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hour = now.getHours();

    const values: TimeSettings = {
      ntpServer: {
        enabled: false,
        url: '0.wled.pool.ntp.org',
      },
      use24HourFormat: true,
      timeZone: 0,
      utcOffsetSeconds: 0,
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
      analogClockOverlay: {
        enabled: false,
        firstLed: 0,
        lastLed: 29, // TODO aribtrary constant
        middleLed: 0,
        show5MinuteMarks: false,
        showSeconds: false,
        showSolidBlack: false, // TODO add to form in ui
      },
      countdown: {
        enabled: false,
        year,
        month,
        day,
        hour,
        minute: 0,
        second: 0,
      },
      presets: {
        alexaOn: 0,
        alexaOff: 0,
        countdownEnd: 0,
        timerEnd: 0,
      },
      buttonActions: [],
      scheduledPresets: [],
      sunrisePreset: DEFAULT_SUNRISE_SUNSET_PRESET,
      sunsetPreset: DEFAULT_SUNRISE_SUNSET_PRESET,
    };
    return values as unknown as FormValues;
  }
}
