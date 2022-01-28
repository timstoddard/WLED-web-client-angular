import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../shared/api.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class PalettesResolver implements Resolve<any /* TODO type */> {
  constructor(private apiService: ApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const PALETTES_PER_PAGE = 8;
    const LAST_PALETTE_DATA_PAGE = 9; // 10 pages (for now) but 0 indexed
    const apiCalls = [];
    for (let page = 0; page < LAST_PALETTE_DATA_PAGE; page++) {
      apiCalls.push(this.apiService.getPalettesData(page));
    }
    return forkJoin(apiCalls);
  }

  // TODO is there a way to use the `.m` property in the resolver?? see below
  /*private _getPalettesData(page: number, callback: () => void) {
    // const url = generateApiUrl(`json/palx?page=${page}`);
    this.palettesService.getPalettes().subscribe((json: any /* TODO type * /) => {
      // if (!res.ok) {
      //   showErrorToast();
      // }
      // return res.json();
      this.palettesData = Object.assign({}, this.palettesData, json.p);
      if (page < json.m) {
        this._getPalettesData(page + 1, callback);
      } else {
        callback();
      }
    }, (error) => {
      // showToast(error, true);
      console.log(error);
    });
  }*/
}
