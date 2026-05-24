import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';

@Injectable({ providedIn: 'root' })
export class PCModeRedirectGuard extends UnsubscriberService implements CanActivate {
  constructor(
    private appStateService: AppStateService,
    private router: Router,
  ) {
    super();
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.appStateService.getLocalSettings(this.ngUnsubscribe).pipe(
      take(1),
      map(({ isPcMode }) => isPcMode
        ? this.router.createUrlTree([''])
        : true
      )
    );
  }
}
