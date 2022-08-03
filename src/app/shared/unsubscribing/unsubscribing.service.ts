import { Injectable, OnDestroy } from '@angular/core';
import { UnsubscribingBaseClass } from './unsubscribing-base.component';

@Injectable({ providedIn: 'root' })
export class UnsubscribingService extends UnsubscribingBaseClass implements OnDestroy {
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
