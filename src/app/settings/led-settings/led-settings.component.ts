import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormService, FormValues } from '../../shared/form-utils';
import { UnsubscribingComponent } from '../../shared/unsubscribing/unsubscribing.component';
import { SelectItem } from '../shared/settings-types';

@Component({
  selector: 'app-led-settings',
  templateUrl: './led-settings.component.html',
  styleUrls: ['./led-settings.component.scss']
})
export class LedSettingsComponent extends UnsubscribingComponent implements OnInit {
  ledSettingsForm!: FormGroup;
  // TODO set this automatically
  hasHighCurrent = true;

  ledVoltageByStripType: SelectItem<number>[] = [
    {
      name: '5V default (55mA)',
      value: 55,
    },
    {
      name: '5V efficient (35mA)',
      value: 35,
    },
    {
      name: '12V (30mA)',
      value: 30,
    },
    {
      name: 'WS2815 (12mA)',
      value: 255,
    },
    {
      name: 'Custom',
      value: 50,
    },
  ];

  // TODO why is the order like this?
  colorOrders: SelectItem<number>[] = [
    {
      name: 'RGB',
      value: 1,
    },
    {
      name: 'RBG',
      value: 3,
    },
    {
      name: 'GRB',
      value: 0,
    },
    {
      name: 'GBR',
      value: 5,
    },
    {
      name: 'BRG',
      value: 2,
    },
    {
      name: 'BGR',
      value: 4,
    },
  ];

  stripTypes: SelectItem<number>[] = [
    {
      name: 'WS281x',
      value: 22,
    },
    {
      name: 'SK6812 RGBW',
      value: 30,
    },
    {
      name: 'TM1814',
      value: 31,
    },
    {
      name: '400kHz',
      value: 24,
    },
    {
      name: 'WS2801',
      value: 50,
    },
    {
      name: 'APA102',
      value: 51,
    },
    {
      name: 'LPD8806',
      value: 52,
    },
    {
      name: 'P9813',
      value: 53,
    },
    {
      name: 'PWM White',
      value: 41,
    },
    {
      name: 'PWM CCT',
      value: 42,
    },
    {
      name: 'PWM RGB',
      value: 43,
    },
    {
      name: 'PWM RGBW',
      value: 44,
    },
    {
      name: 'PWM RGB+CCT',
      value: 45,
    },
    // {
    //   name: 'PWM RGB+DCCT',
    //   value: 46,
    // },
    {
      name: 'DDP RGB (network)',
      value: 80,
    },
    // {
    //   name: 'E1.31 RGB (network)',
    //   value: 81,
    // },
    // {
    //   name: 'ArtNet RGB (network)',
    //   value: 82,
    // },
  ];

  timerModes: SelectItem<number>[] = [
    {
      name: 'Wait and set',
      value: 0,
    },
    {
      name: 'Fade',
      value: 1,
    },
    {
      name: 'Fade Color',
      value: 2,
    },
    {
      name: 'Sunrise',
      value: 3,
    },
  ];

  paletteBlendingOptions: SelectItem<number>[] = [
    {
      name: 'Linear (wrap if moving)',
      value: 0,
    },
    {
      name: 'Linear (always wrap)',
      value: 1,
    },
    {
      name: 'Linear (never wrap)',
      value: 2,
    },
    {
      name: 'None (not recommended)',
      value: 3,
    },
  ];

  constructor(private formService: FormService) {
    super();
  }

  ngOnInit() {
    this.ledSettingsForm = this.createForm();
  }

  submitForm() {
    // TODO
  }

  get ledOutputs() {
    return this.ledSettingsForm.get('ledOutputs') as FormArray;
  }

  addLedOutput() {
    this.ledOutputs.push(this.createLedOutputFormGroup());
  }

  /**
   * Any strip with >800 LEDs might cause stability issues or lag.
   */
  hasLongStrips(/* TODO pass in from form */) {
    // TODO should this be shared?
    const MAX_RECOMMENDED_STRIP_LENGTH = 800;
    // TODO update with actual logic
    const lengths = [100, 801, 500];
    for (const length of lengths) {
      if (length > MAX_RECOMMENDED_STRIP_LENGTH) {
        return true;
      }
    }
    return false;
  }

  private createForm() {
    const formGroup = this.formService.createFormGroup(this.getDefaultFormValues(), {
      ledOutputs: this.formService.formBuilder.array([
        this.createLedOutputFormGroup(),
        this.createLedOutputFormGroup(),
      ]),
    });

    this.getValueChanges<boolean>(formGroup, 'setCurrentPresetAsRebootDefault')
      .subscribe(value => {
        this.toggleRebootPresetIdEnabled(formGroup);
      });
    // initialize disabled status for this control
    this.toggleRebootPresetIdEnabled(formGroup);

    return formGroup;
  }

  private getDefaultFormValues(): FormValues {
    return {
      totalLedCount: 0,
      autoBrightnessLimit: true,
      maxCurrent: 5000,
      ledVoltage: 55,
      buttonPin: 0,
      irPin: -1,
      relayPin: 15,
      activeHigh: true,
      turnOnAfterReboot: true,
      rebootDefaultBrightness: 128,
      rebootDefaultPreset: 0,
      setCurrentPresetAsRebootDefault: false,
      useGammaCorrectionForColor: true,
      useGammaCorrectionForBrightness: true,
      brightnessFactor: 128,
      useCrossfade: true,
      transitionTimeMs: 700,
      usePaletteTransitions: true,
      timer: {
        durationMins: 5,
        targetBrightness: 0,
        mode: 1,
      },
      paletteBlending: 0,
      skipFirstLED: false,
    };
  }

  private createLedOutputFormGroup() {
    return this.formService.createFormGroup({
      stripType: 22,
      colorOrder: 1, // used to be 0,
      pin: 0,
      start: 0,
      count: 0,
      isReverse: false,
    });
  }

  private toggleRebootPresetIdEnabled(rowGroup: FormGroup) {
    if (rowGroup) {
      const isEnabled = rowGroup.get('setCurrentPresetAsRebootDefault')!.value;
      if (isEnabled) {
        // disable related control
        rowGroup.get('rebootDefaultPreset')!.disable({ emitEvent: false });
      } else {
        // enable related control
        rowGroup.get('rebootDefaultPreset')!.enable({ emitEvent: false });
      }
    }
  }
}
