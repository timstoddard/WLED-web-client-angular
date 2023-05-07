import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormService, FormValues, createGetFormControl, getFormControlFn } from '../../shared/form-service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { SelectItem } from '../shared/settings-types';

@Component({
  selector: 'app-led-settings',
  templateUrl: './led-settings.component.html',
  styleUrls: ['./led-settings.component.scss']
})
export class LedSettingsComponent extends UnsubscriberComponent implements OnInit {
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
  getFormControl!: getFormControlFn;

  constructor(private formService: FormService) {
    super();
  }

  ngOnInit() {
    this.ledSettingsForm = this.createForm();
    this.getFormControl = createGetFormControl(this.ledSettingsForm);
  }

  submitForm() {
    const {
      totalLedCount,
      autoBrightnessLimit,
      maxCurrent,
      ledVoltage,
      ledOutputs,
      buttonPin,
      irPin,
      relayPin,
      activeHigh,
      turnOnAfterReboot,
      rebootDefaultBrightness,
      rebootDefaultPreset,
      setCurrentPresetAsRebootDefault,
      useGammaCorrectionForColor,
      useGammaCorrectionForBrightness,
      brightnessFactor,
      useCrossfade,
      transitionTimeMs,
      usePaletteTransitions,
      timer: {
        durationMins,
        targetBrightness,
        mode,
      },
      paletteBlending,
      skipFirstLED,
    } = this.ledSettingsForm.value;

    let apiValue: FormValues = {};
    const convertBoolean = (value: boolean) =>
      value === true ? 'on' : undefined

    // add led output values
    for (let i = 0; i < ledOutputs.length; i++) {
      const {
        stripType,
        colorOrder,
        pin,
        start,
        count,
        isReverse,
      } = ledOutputs[i];
      apiValue = {
        ...apiValue,
        [`LT${i}`]: stripType,
        [`CO${i}`]: colorOrder,
        [`L0${i}`]: pin,
        [`LS${i}`]: start,
        [`LC${i}`]: count,
        // TODO if this is false, should leave it out?
        [`CV${i}`]: convertBoolean(isReverse),

        // TODO are these used for anything?
        // [`L1${i}`]: '',
        // [`L2${i}`]: '',
        // [`L3${i}`]: '',
        // [`L4${i}`]: '',
      }
    }

    // add remaining values
    apiValue = {
      ...apiValue,
      LC: totalLedCount,
      ABen: convertBoolean(autoBrightnessLimit),
      MA: maxCurrent,
      LAsel: ledVoltage,
      // TODO custom voltage limit (number input, 0-255)
      // seems to be not used?
      // LA: 255,
      BT: buttonPin,
      IR: irPin,
      RL: relayPin,
      RM: convertBoolean(activeHigh),
      BO: convertBoolean(turnOnAfterReboot),
      CA: rebootDefaultBrightness,
      BP: rebootDefaultPreset,
      PC: convertBoolean(setCurrentPresetAsRebootDefault),
      GC: convertBoolean(useGammaCorrectionForColor),
      GB: convertBoolean(useGammaCorrectionForBrightness),
      BF: brightnessFactor,
      TF: convertBoolean(useCrossfade),
      TD: transitionTimeMs,
      PF: convertBoolean(usePaletteTransitions),
      TL: durationMins,
      TB: targetBrightness,
      TW: mode,
      PB: paletteBlending,
      SL: convertBoolean(skipFirstLED),
      // TODO seems to not be used
      // "Auto-calculate white channel from RGB"
      // AW: 0,
    }
  }

  trySubmit(e: Event) {
    const d = document;
    const bquot = 0; // TODO how to get this?
    const maxM = 0; // TODO how to get this?
    const Sf = (d as any).Sf;
    Sf.data.value = '';
    e.preventDefault();
    if (!this.pinsOK()) {
      // Prevent form submission and contact with server
      e.stopPropagation();
      return false;
    }
    if (bquot > 100) {
      var msg = "Too many LEDs for me to handle!";
      if (maxM < 10000)
        msg += "\n\rConsider using an ESP32.";
      alert(msg);
    }
    if (Sf.checkValidity()) {
      // https://stackoverflow.com/q/37323914
      Sf.submit();
    }
    return true;
  }

  // TODO get remaining functions from original app
  // UI, lastEnd, addLEDs, etc

  get ledOutputs() {
    return this.ledSettingsForm.get('ledOutputs') as FormArray;
  }

  addLedOutput() {
    this.ledOutputs.push(this.createLedOutputFormGroup());
  }

  clearPin(formControlName: 'buttonPin' | 'irPin' | 'relayPin') {
    const control = this.ledSettingsForm.get(formControlName);
    if (control) {
      control.patchValue(-1, { emitEvent: false });
    }
  }

  // TODO what is this for?
  bLimits(b: number, p: number, m: number, l: number) {
    /*maxB = b;
    maxM = m;
    maxPB = p;
    maxL = l;//*/
  }

  // TODO refactor this and wire up to form
  pinsOK() {
    /*const d = document;
    const LCs = d.getElementsByTagName("input");
    for (let i = 0; i < LCs.length; i++) {
      const nm = LCs[i].name.substring(0, 2);
      // ignore IP address
      if (nm == "L0" || nm == "L1" || nm == "L2" || nm == "L3") {
        const n = LCs[i].name.substring(2);
        const t = parseInt(d.getElementsByName("LT" + n)[0].value, 10); // LED type SELECT
        if (t >= 80) continue;
      }
      //check for pin conflicts
      if (nm == "L0" || nm == "L1" || nm == "L2" || nm == "L3" || nm == "L4" || nm == "RL" || nm == "BT" || nm == "IR")
        if (LCs[i].value != "" && LCs[i].value != "-1") {
          if (d.um_p && d.um_p.some((e) => e == parseInt(LCs[i].value, 10))) { alert(`Sorry, pins ${JSON.stringify(d.um_p)} can't be used.`); LCs[i].value = ""; LCs[i].focus(); return false; }
          else if (LCs[i].value > 5 && LCs[i].value < 12) { alert("Sorry, pins 6-11 can not be used."); LCs[i].value = ""; LCs[i].focus(); return false; }
          else if (!(nm == "IR" || nm == "BT") && LCs[i].value > 33) { alert("Sorry, pins >33 are input only."); LCs[i].value = ""; LCs[i].focus(); return false; }
          for (j = i + 1; j < LCs.length; j++) {
            var n2 = LCs[j].name.substring(0, 2);
            if (n2 == "L0" || n2 == "L1" || n2 == "L2" || n2 == "L3" || n2 == "L4" || n2 == "RL" || n2 == "BT" || n2 == "IR") {
              if (n2.substring(0, 1) === "L") {
                var m = LCs[j].name.substring(2);
                var t2 = parseInt(d.getElementsByName("LT" + m)[0].value, 10);
                if (t2 >= 80) continue;
              }
              if (LCs[j].value != "" && LCs[i].value == LCs[j].value) { alert(`Pin conflict between ${LCs[i].name}/${LCs[j].name}!`); LCs[j].value = ""; LCs[j].focus(); return false; }
            }
          }
        }
    }
    return true;*/

    return true; // temp mock return value
  }

  /**
   * Gets memory usage.
   * @param t 
   * @param len 
   * @param p0 
   * @returns 
   */
  getMem(t: number, len: number, p0: number) {
    const maxM = 0; // TODO how to get this
    if (t < 32) {
      if (maxM < 10000 && p0 == 3) {
        // 8266 DMA uses 5x the mem
        if (t > 29) return len * 20; // RGBW
        return len * 15;
      } else if (maxM >= 10000) {
        // ESP32 RMT uses double buffer?
        return t > 29
          ? len * 8 // RGBW
          : len * 6;
      }
      return t > 29
        ? len * 4 // RGBW
        : len * 3;
    } else if (t > 31 && t < 48) {
      return 5;
    } else if (t == 44 || t == 45) {
      return len * 4; // RGBW
    } else {
      return len * 3;
    }
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
