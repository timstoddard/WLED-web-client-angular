import { Component, OnDestroy } from '@angular/core';
import { UnsubscribingBaseComponent } from './unsubscribing-base.component';

@Component({ template: '' })
export class UnsubscribingComponent extends UnsubscribingBaseComponent implements OnDestroy {
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
