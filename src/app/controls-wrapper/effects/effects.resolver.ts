import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { OnlineStatusService } from '../../shared/online-status.service';
import { SelectedDeviceService } from 'src/app/shared/selected-device.service';
import { MOCK_EFFECTS_DATA_RESPONSE } from '../mock-api-data';
import { StateApiService } from 'src/app/shared/api-service/state-api.service';

@Injectable()
export class EffectsDataResolver implements Resolve<string[]> {
  constructor(
    private stateApiService: StateApiService,
    private onlineStatusService: OnlineStatusService,
    private selectedDeviceService: SelectedDeviceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data

    const ipAddress = route.queryParamMap.get('ip') as string;
    if (ipAddress && this.selectedDeviceService.isNoDeviceSelected()) {
      return this.stateApiService.getEffectData(ipAddress);
    }

    return this.onlineStatusService.getIsOffline()
      ? of(MOCK_EFFECTS_DATA_RESPONSE)
      : this.stateApiService.getEffectData();
  }
}
