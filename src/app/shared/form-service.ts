import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export const getFormControl = (
  formGroup: FormGroup,
  formControlName: string,
) => {
  return formGroup.get(formControlName) as FormControl;
}

export type getFormControlFn = (name: string) => FormControl;
export type getFormArrayFn = (name: string) => FormArray;

/**
 * Simplifies the process of creating a function to return a specific form control
 * @param formGroup form group to get the form control from
 * @returns 
 */
export const createGetFormControl = (formGroup: FormGroup): getFormControlFn => {
  return (name: string) => {
    return formGroup.get(name) as FormControl;
  }
}

/**
 * Simplifies the process of creating a function to return a specific form array
 * @param formGroup form group to get the form array from
 * @returns 
 */
export const createGetFormArray = (formGroup: FormGroup): getFormArrayFn => {
  return (name: string) => {
    return formGroup.get(name) as FormArray;
  }
}

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

  /**
   * Creates a FormControl with an opinionated set of default options.
   * @param value initial value
   * @param updateOn 'change' (default), 'blur', or 'submit'
   * @returns FormControl
   */
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

  /**
   * Creates a FormGroup using the provided dict of values.
   * Appends optional dict of predefined controls to the returned FormGroup.
   * @param values dict of form control names and initial values
   * @param additionalControls optional dict of predefined controls
   * @returns FormGroup
   */
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
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              control = this.createFormArray(value);
            } else {
              control = this.createFormGroup(value as FormValues);
            }
          } else {
            control = this.createFormControl(value);
          }
          formGroup.setControl(key, control);
        }
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

  createFormArray(value: Array<unknown> = []): FormArray {
    return this._formBuilder.array(value);
  }

  get formBuilder() {
    return this._formBuilder;
  }
}
