import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

/**
 * Generalized interface for FormGroup keyvalue pairs.
 * 
 * Possible value types:
 * - common types: string, number, boolean
 * - a nested FormValues object
 * - undefined, for an optional control
 * - null, for controls that explicitly allow it
 */
export type FormValues = { [key: string]: string | number | boolean | FormValues | undefined | null }

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private _formBuilder: FormBuilder) { }

  createFormControl<T>(
    value: T,
    updateOn: 'change' | 'blur' | 'submit' = 'change',
  ) {
    return this._formBuilder.control<T>(value, {
      nonNullable: true,
      // TODO how to handle different/nonexistent validators?
      validators: [Validators.required],
      updateOn,
    });
  }

  createFormGroup(
    values: FormValues,
    additionalControls?: { [key: string]: AbstractControl },
  ) {
    const formGroup = this._formBuilder.group({});
    if (values) {
      // add controls for all the default values
      for (const key in values) {
        const value = values[key];
        const valueIsObject = typeof value === 'object' && value !== null;
        const control = valueIsObject
          ? this.createFormGroup(value as FormValues)
          : this.createFormControl(value);
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
