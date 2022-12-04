import { Injectable, OnDestroy } from '@angular/core';
import { Unsubscriber } from './unsubscriber';

@Injectable({ providedIn: 'root' })
export class UnsubscriberService extends Unsubscriber implements OnDestroy {
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
