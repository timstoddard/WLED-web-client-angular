import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { WledApiResponse } from '../shared/api-types';
import { ControlsServicesModule } from './controls-services.module';
import { data } from './mock-api-data';
import { LocalStorageKey, LocalStorageService } from '../shared/local-storage.service';

@Injectable({ providedIn: ControlsServicesModule })
export class ControlsResolver implements Resolve<WledApiResponse> {
  constructor(
    private apiService: ApiService,
    private localStorageService: LocalStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data

    const isOffline = this.localStorageService.get(LocalStorageKey.IS_OFFLINE);
    return isOffline
      ? of(data)
      : this.apiService.getJson();
  }
}
