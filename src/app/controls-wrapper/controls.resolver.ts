import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { WLEDApiResponse } from '../shared/api-types';
import { MOCK_API_RESPONSE } from './mock-api-data';
import { OnlineStatusService } from '../shared/online-status.service';

@Injectable()
export class ControlsResolver implements Resolve<WLEDApiResponse> {
  constructor(
    private apiService: ApiService,
    private onlineStatusService: OnlineStatusService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data

    return this.onlineStatusService.getIsOffline()
      ? of(MOCK_API_RESPONSE)
      : this.apiService.getJson()
  }
}
