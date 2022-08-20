import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../shared/settings-types';

@Component({
  selector: 'app-led-settings',
  templateUrl: './led-settings.component.html',
  styleUrls: ['./led-settings.component.scss']
})
export class LedSettingsComponent implements OnInit {
  ledSettingsForm!: FormGroup;
  // TODO set this automatically
  hasHighCurrent = true;

  ledVoltageByStripType: SelectItem<number>[] = [
    {
      name: 'WS2815 (12mA)',
      value: 12,
    },
  ];

  // TODO check with current UI order
  colorOrders: SelectItem<string>[] = [
    {
      name: 'RGB',
      value: 'RGB',
    },
    {
      name: 'RBG',
      value: 'RBG',
    },
    {
      name: 'GRB',
      value: 'GRB',
    },
    {
      name: 'GBR',
      value: 'GBR',
    },
    {
      name: 'BRG',
      value: 'BRG',
    },
    {
      name: 'BGR',
      value: 'BGR',
    },
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.ledSettingsForm = this.createForm();
  }

  submitForm() {
    // TODO
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
    return this.formBuilder.group({
      totalLedCount: this.formBuilder.control(0, Validators.required),
      autoBrightnessLimit: this.formBuilder.control(true, Validators.required),
      maxCurrent: this.formBuilder.control(5000, Validators.required),
      ledVoltage: this.formBuilder.control(0, Validators.required),
      ledOutputs: this.formBuilder.array([
        this.createLedOutputForm(),
        this.createLedOutputForm(),
      ]),
      buttonPin: this.formBuilder.control(0, Validators.required),
      irPin: this.formBuilder.control(-1, Validators.required),
      relayPin: this.formBuilder.control(15, Validators.required),
      activeHigh: this.formBuilder.control(true, Validators.required),
      turnOnAfterReset: this.formBuilder.control(true, Validators.required),
      defaultBrightness: this.formBuilder.control(128, Validators.required),
      defaultPreset: this.formBuilder.control(0, Validators.required),
      // TODO "set current preset cycle setting as boot default"
      useGammaCorrectionForColor: this.formBuilder.control(true, Validators.required),
      // add note: recommended true
      useGammaCorrectionForBrightness: this.formBuilder.control(true, Validators.required),
      // add note: recommended false
      brightnessFactor: this.formBuilder.control(128, Validators.required),
      useCrossfade: this.formBuilder.control(true, Validators.required),
      // value in ms
      transitionTimeMs: this.formBuilder.control(70, Validators.required),
      usePaletteTransitions: this.formBuilder.control(true, Validators.required),
      timer: this.formBuilder.group({
        durationMins: this.formBuilder.control(5, Validators.required),
        targetBrightness: this.formBuilder.control(0, Validators.required),
        mode: this.formBuilder.control('', Validators.required),
      }),
      paletteBlending: this.formBuilder.control('', Validators.required),
      skipFirstLED: this.formBuilder.control(false, Validators.required),
    });
  }

  private createLedOutputForm() {
    return this.formBuilder.group({
      stripType: this.formBuilder.control('', Validators.required),
      colorOrder: this.formBuilder.control('', Validators.required),
      pin: this.formBuilder.control(0, Validators.required),
      start: this.formBuilder.control(0, Validators.required),
      count: this.formBuilder.control(0, Validators.required),
      isReverse: this.formBuilder.control(false, Validators.required),
    })
  }
}
