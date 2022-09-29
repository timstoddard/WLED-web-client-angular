import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, FormValues } from '../../shared/form-service';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent implements OnInit {
  securitySettingsForm!: FormGroup;
  // TODO how to get this from wled repo?
  versionNumber = '0.12.0';

  constructor(private formService: FormService) {}

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

    // TODO api call
  }

  private createForm() {
    return this.formService.createFormGroup(this.getDefaultFormValues());
  }

  private getDefaultFormValues(): FormValues {
    return {
      secureWirelessUpdate: false,
      otaUpdatePassword: '',
      denyWifiSettingsAccessIfLocked: false,
      triggerFactoryReset: false,
      enableArduinoOTA: true,
    };
  }
}
