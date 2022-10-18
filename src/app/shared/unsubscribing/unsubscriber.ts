import { Observable, Subject, takeUntil } from 'rxjs';

export class Unsubscriber {
  protected ngUnsubscribe = new Subject<void>();

  handleUnsubscribe<T>(observable: Observable<T>) {
    return observable.pipe(takeUntil(this.ngUnsubscribe));
  }
}
