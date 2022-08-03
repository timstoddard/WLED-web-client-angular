import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { WledApiResponse } from '../shared/api-types';
import { ControlsServicesModule } from './controls-services.module';
import { data } from './mock-api-data';
import { OnlineStatusService } from '../shared/online-status.service';

@Injectable({ providedIn: ControlsServicesModule })
export class ControlsResolver implements Resolve<WledApiResponse> {
  constructor(
    private apiService: ApiService,
    private onlineStatusService: OnlineStatusService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data

    return this.onlineStatusService.getIsOffline()
      ? of(data)
      : this.apiService.getJson()
  }
}
