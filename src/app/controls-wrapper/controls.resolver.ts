import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../shared/api-service/api.service';
import { WLEDApiResponse } from '../shared/api-types/api-types';
import { MOCK_API_RESPONSE } from './mock-api-data';
import { OnlineStatusService } from '../shared/online-status.service';
import { SelectedDeviceService } from '../shared/selected-device.service';

@Injectable()
export class ControlsResolver implements Resolve<WLEDApiResponse> {
  constructor(
    private apiService: ApiService,
    private onlineStatusService: OnlineStatusService,
    private selectedDeviceService: SelectedDeviceService,
  ) { }

  // TODO should probably combine the controls/presets/palettes resolvers into a single forkJoin
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data

    const ipAddress = route.queryParamMap.get('ip') as string;
    if (ipAddress && this.selectedDeviceService.isNoDeviceSelected()) {
      return this.apiService.appState.json.get(ipAddress);
    }

    return this.onlineStatusService.getIsOffline()
      ? of(MOCK_API_RESPONSE)
      : this.apiService.appState.json.get();
  }
}
