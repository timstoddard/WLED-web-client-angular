import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Unsubscriber } from './unsubscriber';
import { distinctUntilChanged } from 'rxjs';

@Component({ template: '' })
export class UnsubscriberComponent extends Unsubscriber implements OnDestroy {
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getValueChanges<T>(form: FormGroup, controlName?: string | string[]) {
    let control: AbstractControl | null = form;

    if (controlName) {
      if (Array.isArray(controlName)) {
        // find a nested control
        control = form;
        for (const key of controlName) {
          if (control) {
            control = control.get(key);
          } else {
            break;
          }
        }
      } else {
        // find a top-level control
        control = form.get(controlName);
      }
    }

    if (!control) {
      throw `Could not find control with name: ${controlName}`;
    }

    // TODO verify that distinctUntilChanged doesn't cause any regressions
    return this.handleUnsubscribe<T>(control.valueChanges)
      .pipe(distinctUntilChanged());
  }
}
