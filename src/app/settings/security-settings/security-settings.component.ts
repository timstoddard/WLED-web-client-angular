import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent implements OnInit {
  securitySettingsForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.securitySettingsForm = this.createForm();
  }

  private createForm() {
    return this.formBuilder.group({
      otaUpdatePassword: this.formBuilder.control('', Validators.required),
      denyWifiSettingsAccessIfLocked: this.formBuilder.control(false, Validators.required),
      triggerFactoryReset: this.formBuilder.control(false, Validators.required),
      enableArduinoOTA: this.formBuilder.control(true, Validators.required),
    });
  }
}
