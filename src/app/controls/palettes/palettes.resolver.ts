import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiHttpService } from '../../shared/api-http.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class PalettesResolver implements Resolve<any /* TODO type */> {
  constructor(private apiService: ApiHttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const PALETTES_PER_PAGE = 8;
    const LAST_PALETTE_DATA_PAGE = 9; // 10 pages (for now) but 0 indexed
    const apiCalls = [];
    for (let page = 0; page < LAST_PALETTE_DATA_PAGE; page++) {
      apiCalls.push(this.apiService.getPalettesData(page));
    }
    return forkJoin(apiCalls);
  }
}
