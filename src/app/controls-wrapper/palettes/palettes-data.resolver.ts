import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { ApiService } from '../../shared/api-service/api.service';
import { OnlineStatusService } from '../../shared/online-status.service';
import { MOCK_PALETTES_DATA } from '../mock-api-data';
import { PalettesApiData } from './palettes.service';
import { SelectedDeviceService } from 'src/app/shared/selected-device.service';

@Injectable()
export class PalettesDataResolver implements Resolve<PalettesApiData[]> {
  constructor(
    private apiService: ApiService,
    private onlineStatusService: OnlineStatusService,
    private selectedDeviceService: SelectedDeviceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const ipAddress = route.queryParamMap.get('ip') as string;
    if (ipAddress && this.selectedDeviceService.isNoDeviceSelected()) {
      return this.getAllPages(ipAddress);
    }

    return this.onlineStatusService.getIsOffline()
      ? of(MOCK_PALETTES_DATA)
      : this.getAllPages();
  }

  private getAllPages(ipAddress?: string) {
    // TODO can merge all response objects together instead of returning an array?

    // const PALETTES_PER_PAGE = 8;
    const LAST_PALETTE_DATA_PAGE = 9; // 9 pages (for now), zero indexed
    const apiCalls = [];
    for (let page = 0; page < LAST_PALETTE_DATA_PAGE; page++) {
      apiCalls.push(this.apiService.appState.palette.getData(page, ipAddress));
    }
    return forkJoin(apiCalls);
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
    // let palettesDataJson = this.localStorageService.get(LocalStorageKey.PALETTES_DATA) as any; // TODO type
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
    this.localStorageService.set(LocalStorageKey.PALETTES_DATA, {
      p: this.palettesData,
      vid: lastinfo.vid,
    });
    this.redrawPalPrev();
    if (callback) {
      setTimeout(callback, 99); // go on to connect websocket
    }
  });//*/
}
