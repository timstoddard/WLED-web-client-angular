import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormService, FormValues, createGetFormControl, getFormControl, getFormControlFn } from '../../shared/form-service';
import { UnsubscriberComponent } from 'src/app/shared/unsubscriber/unsubscriber.component';
import { SecuritySettingsService } from './security-settings.service';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';
import { FormControlRequirementConfig } from 'src/app/shared/form-control-requirements/form-control-requirements.component';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent extends UnsubscriberComponent implements OnInit {
  securitySettingsForm!: FormGroup;
  getFormControl!: getFormControlFn;
  versionNumber!: string;

  settingsPinInputConfig: InputConfig = {
    type: 'password',
    getFormControl: () => getFormControl(this.securitySettingsForm, 'settingsPin'),
    placeholder: 'PIN',
    widthPx: 100,
    inputMode: 'numeric',
    pattern: '[0-9]*',
  };

  settingsPinRequirements: FormControlRequirementConfig[] = [
    {
      path: 'settingsPin',
      errorName: 'pattern',
      description: 'Only numbers',
    },
    {
      path: 'settingsPin',
      errorName: 'invalidLength',
      description: 'Length must be 4',
    },
  ];

  OTAPasswordInputConfig: InputConfig = {
    type: 'password',
    getFormControl: () => getFormControl(this.securitySettingsForm, 'otaUpdatePassword'),
    placeholder: '',
    widthPx: 200,
  };

  OTAPasswordRequirements: FormControlRequirementConfig[] = [
    {
      path: 'otaUpdatePassword',
      errorName: 'maxLength',
      description: 'Max length is 32',
    },
  ];

  constructor(
    private formService: FormService,
    private securitySettingsService: SecuritySettingsService,
    private snackbarService: SnackbarService,
  ) {
    super();
  }

  ngOnInit() {
    this.securitySettingsForm = this.createForm();
    this.getFormControl = createGetFormControl(this.securitySettingsForm);

    this.handleUnsubscribe(
      this.securitySettingsService.getParsedValues()
    ).subscribe(({ formValues, metadata }) => {
      console.log(' >>> SECURITY formValues', formValues)
      console.log(' >>> SECURITY metadata', metadata)
      this.securitySettingsForm.patchValue(formValues);
      this.versionNumber = metadata['wledVersion'] as string;
    });
  }

  submitForm() {
    const {
      settingsPin,
      secureWirelessUpdate,
      otaUpdatePassword,
      denyWifiSettingsAccessIfLocked,
      triggerFactoryReset,
      enableArduinoOTA,
    } = this.securitySettingsForm.value;
    const settings = {
      settingsPin,
      secureWirelessUpdate,
      otaUpdatePassword,
      denyWifiSettingsAccessIfLocked,
      triggerFactoryReset,
      enableArduinoOTA,
    };

    this.handleUnsubscribe(
      this.securitySettingsService.setSecuritySettings(settings)
    ).subscribe((responseHTML: string) => {
      const expectedText = 'Security settings saved.';
      const snackbarMessage = responseHTML.includes(expectedText)
        ? 'Security settings were updated successfully.'
        : 'Error: Security settings were NOT updated.';
      this.snackbarService.openSnackBar(snackbarMessage);
    });
  }

  downloadPresetsFile() {
    this.securitySettingsService.downloadPresetsFile()
  }

  downloadConfigFile() {
    this.securitySettingsService.downloadConfigFile()
  }

  private createForm() {
    // TODO which (if any) of these should be required by default?
    const form = this.formService.createFormGroup(this.getDefaultFormValues());
    form.get('settingsPin')!.addValidators([
      this.validateLengthIsExactly([0, 4]),
      Validators.pattern(/[0-9]*/),
    ]);
    form.get('otaUpdatePassword')!.addValidators([
      Validators.minLength(0),
      Validators.maxLength(32),
    ]);
    return form;
  }

  private validateLengthIsExactly(allowedLengths: number[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const length = control.value ? control.value.length : 0;
      for (const allowedLength of allowedLengths) {
        if (length === allowedLength) {
          return null;
        }
      }
      return {
        invalidLength: length,
      };
    };
  }

  private getDefaultFormValues(): FormValues {
    return {
      settingsPin: '',
      secureWirelessUpdate: false,
      otaUpdatePassword: '', // not included in server response
      denyWifiSettingsAccessIfLocked: false,
      triggerFactoryReset: false, // not included in server response
      enableArduinoOTA: true,
    };
  }
}
