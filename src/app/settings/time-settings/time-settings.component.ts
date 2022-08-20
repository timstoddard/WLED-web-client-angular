import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-time-settings',
  templateUrl: './time-settings.component.html',
  styleUrls: ['./time-settings.component.scss']
})
export class TimeSettingsComponent implements OnInit {
  timeSettingsForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.timeSettingsForm = this.createForm();
  }

  private createForm() {
    return this.formBuilder.group({
      ntp: this.formBuilder.group({
        enable: this.formBuilder.control(false, Validators.required),
        ntpServer: this.formBuilder.control('0.wled.pool.ntp.org', Validators.required),
      }),
      use24HourTime: this.formBuilder.control(true, Validators.required),
      timeZone: this.formBuilder.control('', Validators.required),
      utcOffsetSeconds: this.formBuilder.control(0, Validators.required),
      latitude: this.formBuilder.control(0, Validators.required),
      longitude: this.formBuilder.control(0, Validators.required),
      clock: this.formBuilder.group({
        overlay: this.formBuilder.control('', Validators.required),
        isCountdown: this.formBuilder.control(false, Validators.required),
        countdownEnd: this.formBuilder.group({
          year: this.formBuilder.control(2022, Validators.required),
          month: this.formBuilder.control(1, Validators.required),
          day: this.formBuilder.control(1, Validators.required),
          hour: this.formBuilder.control(0, Validators.required),
          minute: this.formBuilder.control(0, Validators.required),
          second: this.formBuilder.control(0, Validators.required),
        }),
      }),
      macroPresets: this.formBuilder.group({
        alexaOn: this.formBuilder.control(0, Validators.required),
        alexaOff: this.formBuilder.control(0, Validators.required),
        buttonShortPress: this.formBuilder.control(0, Validators.required),
        buttonLongPress: this.formBuilder.control(0, Validators.required),
        buttonDoublePress: this.formBuilder.control(0, Validators.required),
        countdownEnd: this.formBuilder.control(0, Validators.required),
        timerEnd: this.formBuilder.control(0, Validators.required),
      }),
      timeBasedPresets: this.createTimeBasedPresetsForm(),
    });
  }

  private createTimeBasedPresetsForm() {
    return this.formBuilder.array([
      this.createTimeBasedPresetFormGroup(),
      this.createTimeBasedPresetFormGroup(),
      this.createTimeBasedPresetFormGroup(),
      // TODO need sunrise/sunset options too
    ]);
  }

  private createTimeBasedPresetFormGroup() {
    return this.formBuilder.group({
      enabled: this.formBuilder.control(true, Validators.required),
      hour: this.formBuilder.control(0, Validators.required),
      minute: this.formBuilder.control(0, Validators.required),
      presetId: this.formBuilder.control(0, Validators.required),
      enabledDays: this.formBuilder.group({
        sunday: this.formBuilder.control(true, Validators.required),
        monday: this.formBuilder.control(true, Validators.required),
        tuesday: this.formBuilder.control(true, Validators.required),
        wednesday: this.formBuilder.control(true, Validators.required),
        thursday: this.formBuilder.control(true, Validators.required),
        friday: this.formBuilder.control(true, Validators.required),
        saturday: this.formBuilder.control(true, Validators.required),
      }),
    });
  }
}
