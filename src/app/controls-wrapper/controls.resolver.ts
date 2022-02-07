import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { WledApiResponse } from '../shared/api-types';
import { ControlsServicesModule } from './controls-services.module';
// import { of } from 'rxjs';
// import { data } from './mock-api-data';

@Injectable({ providedIn: ControlsServicesModule })
export class ControlsResolver implements Resolve<WledApiResponse> {
  constructor(private apiService: ApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data
    // return of(data);
    return this.apiService.getJson();
  }
}
