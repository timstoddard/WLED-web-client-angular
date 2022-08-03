import { Component, OnDestroy } from '@angular/core';
import { UnsubscribingBaseClass } from './unsubscribing-base.component';

@Component({ template: '' })
export class UnsubscribingComponent extends UnsubscribingBaseClass implements OnDestroy {
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
