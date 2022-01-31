import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PalettesData } from '../controls-wrapper/palettes/palettes.service';
import { WledApiResponse, WledInfo, WledState } from './api-types';

export interface PostResponse {
  success: boolean;
}

const ALL_JSON_PATH = 'json';
const STATES_PATH = 'json/state';
const INFO_PATH = 'json/info';
const EFFECTS_PATH = 'json/eff';
const PALETTES_PATH = 'json/pal';
const PALETTES_DATA_PATH = 'json/palx';

@Injectable({ providedIn: 'root' })
export class ApiService {
  BASE_URL = 'http://192.168.100.154';

  constructor(private http: HttpClient) {}

  private createApiUrl = (path: string) => {
    return `${this.BASE_URL}/${path}`;
  }

  /** Returns an object containing the state, info, effects, and palettes. */
  getJson() {
    return this.http.get<WledApiResponse>(
      this.createApiUrl(ALL_JSON_PATH));
  }

  /** Contains the current state of the light. All values may be modified by the client. */
  getState() {
    return this.http.get<WledState>(
      this.createApiUrl(STATES_PATH));
  }

  /** Contains general information about the device. All values are read-only. */
  getInfo() {
    return this.http.get<WledInfo>(
      this.createApiUrl(INFO_PATH));
  }

  /** Contains an array of the effect mode names. */
  getEffects() {
    return this.http.get<string[]>(
      this.createApiUrl(EFFECTS_PATH));
  }

  /** Contains an array of the palette names. */
  getPalettes() {
    return this.http.get<string[]>(
      this.createApiUrl(PALETTES_PATH));
  }

  /** Gets palettes data, 8 palettes per page. */
  getPalettesData(page: number) {
    const params = new HttpParams()
      .set('page', page);
    return this.http.get<PalettesData>(
      this.createApiUrl(PALETTES_DATA_PATH), { params });
  }

  /** Sets current palette by id. */
  setPalette(paletteId: number) {
    const body = {
      seg: { pal: paletteId },
    };
    return this.http.post<PostResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Sets current effect by id. */
  setEffect(effectId: number) {
    const body = {
      seg: { fx: effectId },
    };
    return this.http.post<PostResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Sets light brightness. */
  setBrightness(brightness: number) {
    const body = { bri: brightness };
    return this.http.post<PostResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Sets effect speed. */
  setSpeed(speed: number) {
    const body = {
      seg: { sx: speed },
    };
    return this.http.post<PostResponse>(
      this.createApiUrl('json/state'), body);
  }

  /** Sets effect intensity. */
  setIntensity(intensity: number) {
    const body = {
      seg: { ix: intensity },
    };
    return this.http.post<PostResponse>(
      this.createApiUrl('json/state'), body);
  }

  /** Toggles the LED strip(s) on/off. */
  togglePower(isOn: boolean) {
    const body = { on: isOn };
    return this.http.post<PostResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Toggles the night light timer on/off. */
  toggleNightLight(isNightLightActive: boolean) {
    const body = {
      nl: { on: isNightLightActive },
    };
    return this.http.post<PostResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Toggles the night light timer on/off. */
  toggleSync(syncSend: boolean, syncTglRecv: boolean) {
    const body: any /* TODO type */ = {
      udpn: { send: syncSend },
    };
    if (syncTglRecv) {
      body.udpn.recv = syncSend;
    }
    return this.http.post<PostResponse>(
      this.createApiUrl('json/si'), body);
  }




















  

  setLor(lor: number) {
    const obj = { lor };
    this.http.post('/json/si', obj);
    // this.requestJson(obj);
  }

  setBalance(balance: number) {
    const obj = {
      seg: { cct: balance },
    };
    this.http.post('/json/si', obj);
    // this.requestJson(obj);
  }

  // setSi(lor: number) {
  //   const obj = { lor };
  //   this.http.post('/json/si', obj);
  //   // this.requestJson(obj);
  // }

  // getSi(lor: number) {
  //   const obj = { lor };
  //   this.http.post('/json/si', obj);
  //   // this.requestJson(obj);
  // }

  getNodes() {
    return this.http.get('/json/nodes');
  }

  // TODO better name
  setJsonObj(obj: any) {
  }

  requestJson(command: any /* TODO type */, rinfo = true) {
    const url = rinfo
      ? 'json/si'
      : (command ? 'json/state' : 'json');
    if (rinfo) {
      // 'json/si'
    } else if (command) {
      // 'json/state'
    } else {
      // 'json'
    }

    if (command) {
      // TODO set data
    } else {
      // TODO get data
    }
  }
}
