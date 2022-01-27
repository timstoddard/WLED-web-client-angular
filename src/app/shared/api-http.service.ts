import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WledApiResponse } from './api-types';

@Injectable({ providedIn: 'root' })
export class ApiHttpService {
  BASE_URL = 'http://192.168.100.154';

  constructor(private http: HttpClient) {}

  private createApiUrl = (path: string) => {
    return `${this.BASE_URL}/${path}`;
  }

  /** Returns an object containing the state, info, effects, and palettes. */
  getJson() {
    return this.http.get<WledApiResponse>(this.createApiUrl('json'));
  }

  /** Contains the current state of the light. All values may be modified by the client. */
  getState() {
    return this.http.get(this.createApiUrl('json/state'));
  }

  /** Contains general information about the device. All values are read-only. */
  getInfo() {
    return this.http.get(this.createApiUrl('json/info'));
  }

  /** Contains an array of the effect mode names. */
  getEffects() {
    return this.http.get(this.createApiUrl('json/eff'));
  }

  /** Contains an array of the palette names. */
  getPalettes() {
    return this.http.get(this.createApiUrl('json/pal'));
  }

  /** Gets palettes data, 8 palettes per page. */
  getPalettesData(page: number) {
    const params = new HttpParams()
      .set('page', page);
    return this.http.get(this.createApiUrl('json/palx'), { params });
  }




















  setBrightness(brightness: number) {
    const obj = { bri: brightness };
    this.http.post('/json/si', obj);
    // this.requestJson(obj);
  }

  setSpeed(speed: number) {
    const obj = {
      seg: { sx: speed },
    };
    this.http.post('/json/si', obj);
    // this.requestJson(obj, false);
  }

  setIntensity(intensity: number) {
    const obj = {
      seg: { ix: intensity },
    };
    this.http.post('/json/state', obj);
    // this.requestJson(obj, false);
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
    // TODO api paths belong in ApiHttpService, not here
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
