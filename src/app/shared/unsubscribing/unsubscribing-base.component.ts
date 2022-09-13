import { Observable, Subject, takeUntil } from 'rxjs';

export class UnsubscribingBaseClass {
  protected ngUnsubscribe = new Subject<void>();

  handleUnsubscribe<T>(observable: Observable<T>) {
    return observable.pipe(takeUntil(this.ngUnsubscribe));
  }
}
