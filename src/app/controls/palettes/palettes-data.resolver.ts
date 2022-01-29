import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { ApiService } from '../../shared/api.service';
import { ControlsServicesModule } from '../controls-services.module';
import { palettesData } from '../mock-api-data';
import { PalettesData } from './palettes.service';

@Injectable({ providedIn: ControlsServicesModule })
export class PalettesDataResolver implements Resolve<PalettesData[]> {
  constructor(private apiService: ApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO use api data
    return of(palettesData);

    // TODO can merge all response objects together instead of returning an array?

    /* // const PALETTES_PER_PAGE = 8;
    const LAST_PALETTE_DATA_PAGE = 9; // 9 pages (for now), zero indexed
    const apiCalls = [];
    for (let page = 0; page < LAST_PALETTE_DATA_PAGE; page++) {
      apiCalls.push(this.apiService.getPalettesData(page));
    }
    return forkJoin(apiCalls); */
  }

  // TODO is there a way to use the `.m` property in the resolver?? seems to be max page #, or results per page
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

// TODO add this logic to resolver (only call api if localStorage data invalid)
const loadPalettesData = (callback: (() => void) = () => { }) => { // TODO can remove callback param?
  try {
    // TODO attempt to load palettes data from local storage
    // const key = 'wledPalx';
    // let palettesDataJson = this.localStorageService.get(key) as any; // TODO type
    // palettesDataJson = JSON.parse(palettesDataJson);
    // const now = new Date();
    // const palettesDataJson = getPalettesData();
    // if (palettesDataJson /*&& palettesDataJson.vid === lastinfo.vid*/) {
    //   this.palettesData = palettesDataJson.p;
    //   // this.redrawPalPrev()
    //   callback();
    //   return;
    // }
  } catch (e) { }

  // TODO load palettes data, store in a field, save in local storage, update UI
  // TODO also do something with websocket connect callback
  /*this.palettesData = {};
  this._getPalettesData(0, () => {
    this.localStorageService.set(key, {
      p: this.palettesData,
      vid: lastinfo.vid,
    });
    this.redrawPalPrev();
    if (callback) {
      setTimeout(callback, 99); // go on to connect websocket
    }
  });//*/
}
