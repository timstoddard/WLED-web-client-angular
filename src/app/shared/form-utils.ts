import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

export type FormValues = { [key: string]: unknown }

// TODO rename file to form-service.ts

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private _formBuilder: FormBuilder) { }

  createFormGroup(
    values: FormValues,
    additionalControls?: { [key: string]: AbstractControl },
  ) {
    const formGroup = this._formBuilder.group({});
    if (values) {
      // add controls for all the default values
      for (const key in values) {
        const value = values[key];
        let control: AbstractControl;
        if (typeof value === 'object' && value !== null) {
          control = this.createFormGroup(value as FormValues);
        } else {
          // TODO how to handle different/nonexistent validators?
          control = this._formBuilder.control(value, Validators.required);
        }
        formGroup.setControl(key, control);
      }
    }
    if (additionalControls) {
      // add custom controls, if provided
      for (const key in additionalControls) {
        const control = additionalControls[key];
        formGroup.setControl(key, control);
      }
    }
    return formGroup;
  }

  get formBuilder() {
    return this._formBuilder;
  }
}
