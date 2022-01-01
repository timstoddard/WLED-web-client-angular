import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent implements OnInit {
  securitySettingsForm!: FormGroup;
  private defaultFormValues: any = {
    otaUpdatePassword: '',
    denyWifiSettingsAccessIfLocked: false,
    triggerFactoryReset: false,
    enableArduinoOTA: true,
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.securitySettingsForm = this.createForm();
  }

  submitForm() {
    const {
      otaUpdatePassword,
      denyWifiSettingsAccessIfLocked,
      triggerFactoryReset,
      enableArduinoOTA,
    } = this.securitySettingsForm.value;
  }

  private createForm() {
    // TODO does this add proper validators (all required)?
    return this.formBuilder.group(this.defaultFormValues);
  }
}
