import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../../shared/api.service';
import { AppPreset } from '../../shared/app-types';
import { OnlineStatusService } from '../../shared/online-status.service';
import { MOCK_LOCAL_PRESETS } from '../mock-api-data';

@Injectable()
export class PresetsResolver implements Resolve<AppPreset[]> {
  constructor(
    private apiService: ApiService,
    private onlineStatusService: OnlineStatusService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data

    return this.onlineStatusService.getIsOffline()
      ? of(MOCK_LOCAL_PRESETS)
      : this.apiService.getPresets()
  }
}
