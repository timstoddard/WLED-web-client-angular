import { Injectable, OnDestroy } from '@angular/core';
import { UnsubscribingBaseComponent } from './unsubscribing-base.component';

@Injectable({ providedIn: 'root' })
export class UnsubscribingService extends UnsubscribingBaseComponent implements OnDestroy {
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
