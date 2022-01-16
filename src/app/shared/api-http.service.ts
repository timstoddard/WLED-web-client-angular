import { HttpClient, HttpParams } from '@angular/common/http';

export class ApiHttpService {
  constructor(private http: HttpClient) {}

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

  getPalettes(page: string) {
    const params = new HttpParams()
      .set('page', page);
    return this.http.get('/json/palx', { params });
  }

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
