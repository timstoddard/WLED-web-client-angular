import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { WLEDPresets } from '../../shared/api-types/api-presets';
import { ApiService } from '../../shared/api-service/api.service';
import { OnlineStatusService } from '../../shared/online-status.service';
import { MOCK_API_PRESETS } from '../mock-api-data';
import { SelectedDeviceService } from 'src/app/shared/selected-device.service';

@Injectable()
export class PresetsResolver implements Resolve<WLEDPresets> {
  constructor(
    private apiService: ApiService,
    private onlineStatusService: OnlineStatusService,
    private selectedDeviceService: SelectedDeviceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data

    const ipAddress = route.queryParamMap.get('ip') as string;
    if (ipAddress && this.selectedDeviceService.isNoDeviceSelected()) {
      return this.apiService.preset.getAll(ipAddress);
    }

    return this.onlineStatusService.getIsOffline()
      ? of(MOCK_API_PRESETS)
      : this.apiService.preset.getAll()
  }
}
