import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, concatMap, map, of } from 'rxjs';
import { ApiService } from '../shared/api-service/api.service';
import { WLEDApiResponse } from '../shared/api-types/api-types';
import { MOCK_API_PRESETS, MOCK_API_RESPONSE, MOCK_EFFECTS_DATA_RESPONSE, MOCK_PALETTES_DATA } from './mock-api-data';
import { OnlineStatusService } from '../shared/online-status.service';
import { SelectedDeviceService } from '../shared/selected-device.service';
import { StateApiService } from '../shared/api-service/state-api.service';
import { PresetApiService } from '../shared/api-service/preset-api.service';
import { WLEDPresets } from '../shared/api-types/api-presets';
import { WLEDPalettesData } from '../shared/api-types/api-palettes';

// TODO move this to a type definition file
export interface CombinedResponse extends WLEDApiResponse {
  effectsData: string[];
  presets: WLEDPresets;
  palettesData: WLEDPalettesData[];
}

@Injectable()
export class ApiDataResolver implements Resolve<CombinedResponse> {
  constructor(
    private apiService: ApiService,
    private onlineStatusService: OnlineStatusService,
    private selectedDeviceService: SelectedDeviceService,
    private stateApiService: StateApiService,
    private presetApiService: PresetApiService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO set up playground with mock data

    const ipAddress = route.queryParamMap.get('ip') as string;
    if (ipAddress && this.selectedDeviceService.isNoDeviceSelected()) {
      return this.getApiData(ipAddress);
    }

    return this.onlineStatusService.getIsOffline()
      ? of({
        ...MOCK_API_RESPONSE,
        effectsData: MOCK_EFFECTS_DATA_RESPONSE,
        presets: MOCK_API_PRESETS,
        palettesData: MOCK_PALETTES_DATA,
      })
      : this.getApiData(ipAddress);
  }

  private getApiData(ipAddress?: string) {
    let chainedResponse = this.apiService.getJson(ipAddress)
      .pipe(
        concatMap(this.getEffectData(ipAddress)),
        concatMap(this.getPresets(ipAddress)),
      )
    chainedResponse = this.getAllPages(chainedResponse, ipAddress);
    return chainedResponse as Observable<CombinedResponse>;
  }

  private getEffectData = <T>(ipAddress?: string) => (n: T) =>
    this.stateApiService.getEffectData(ipAddress).pipe(map(effectsData => ({ ...n, effectsData })));

  private getPresets = <T>(ipAddress?: string) => (n: T) =>
    this.presetApiService.getPresets(ipAddress).pipe(map(presets => ({ ...n, presets })));

  private getAllPages<T>(_obs: Observable<T>, ipAddress?: string) {
    // const PALETTES_PER_PAGE = 8;
    const LAST_PALETTE_DATA_PAGE = 9; // 9 pages (for now), zero indexed
    let obs = _obs.pipe(map(n => ({
      ...n,
      palettesData: [] as WLEDPalettesData[],
    })))
    for (let page = 0; page < LAST_PALETTE_DATA_PAGE; page++) {
      obs = obs.pipe(concatMap(n => this.stateApiService.getPalettesData(page, ipAddress).pipe(map(palettesData => ({
        ...n,
        // TODO merge all response objects together instead of returning an array
        palettesData: [...n.palettesData, palettesData],
      })))));
    }
    return obs;
  }
}
