import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';

export class UnsubscribingBaseComponent {
  protected ngUnsubscribe = new Subject<void>();

  handleUnsubscribe<T>(observable: Observable<T>) {
    return observable.pipe(takeUntil(this.ngUnsubscribe));
  }

  getValueChanges<T>(form: FormGroup, controlName: string | string[]) {
    let control!: AbstractControl;
    if (Array.isArray(controlName)) {
      control = form;
      for (const key of controlName) {
        control = control.get(key)!;
      }
    } else {
      control = form.get(controlName)!;
    }
    if (!control) {
      console.log('Could not find control with name:', controlName);
      throw 'Could not find form control!';
    }
    return this.handleUnsubscribe<T>(control.valueChanges);
  }
}
