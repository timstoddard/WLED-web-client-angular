import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, timeout } from 'rxjs';
import { PalettesApiData } from '../controls-wrapper/palettes/palettes.service';
import { APIPreset, APIPresets } from '../controls-wrapper/presets/presets.api';
import { Preset } from '../controls-wrapper/presets/presets.service';
import { SavePresetRequest, WledApiResponse, WledInfo, WledState } from './api-types';
import { AppStateService } from './app-state/app-state.service';
import { AppState, Segment } from './app-types';
import { FormValues } from './form-utils';
import { LiveViewData } from './live-view/live-view.service';
import { UnsubscribingService } from './unsubscribing/unsubscribing.service';

const ALL_JSON_PATH = 'json';
const STATES_PATH = 'json/state';
const INFO_PATH = 'json/info';
const EFFECTS_PATH = 'json/eff';
const PALETTES_PATH = 'json/pal';
const PALETTES_DATA_PATH = 'json/palx';
const LIVE_PATH = 'json/live';

const LED_SETTINGS_PATH = 'settings/leds';
const UI_SETTINGS_PATH = 'settings/ui';
const WIFI_SETTINGS_PATH = 'settings/wifi';

@Injectable({ providedIn: 'root' })
export class ApiService extends UnsubscribingService {
  private baseUrl = '';

  // !!! TODO need to handle app loading without any WLED instances connected !!!

  constructor(
    private http: HttpClient,
    appStateService: AppStateService,
  ) {
    super();
    appStateService.getSelectedWledIpAddress(this.ngUnsubscribe)
      .subscribe(({ ipv4Address  }) => {
        this.baseUrl = ipv4Address;
      });
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  private createApiUrl = (path: string) => {
    return `http://${this.baseUrl}/${path}`;
  }

  testIpAddressAsBaseUrl(ipAddress: string) {
    const TIMEOUT_MS = 3000;
    const FAILED = 'FAILED';
    const url = `http://${ipAddress}/${ALL_JSON_PATH}`;
    return this.http.get<WledApiResponse>(url)
      .pipe(
        timeout({
          first: TIMEOUT_MS,
          with: () => of<typeof FAILED>(FAILED),
        }),
        map(result => {
          let success = false;

          if (result === FAILED) {
            // it didn't work
            success = false;
          } else if (
            result.state
            && result.info
            && result.palettes
            && result.effects
          ) {
            // it worked
            success = true;
          }

          return { success };
        })
      );
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
    return this.http.get<PalettesApiData>(
      this.createApiUrl(PALETTES_DATA_PATH), { params });
  }

  /** Gets live data for all LEDs. */
  getLiveData() {
    return this.http.get<LiveViewData>(
      this.createApiUrl(LIVE_PATH));
  }

  /** Sets current palette by id. */
  setPalette(paletteId: number) {
    const body = this.createBody({
      seg: { pal: paletteId },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Sets current effect by id. */
  setEffect(effectId: number) {
    const body = this.createBody({
      seg: { fx: effectId },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Sets light brightness. */
  setBrightness(brightness: number) {
    const body = this.createBody({ bri: brightness });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Sets effect speed. */
  setSpeed(speed: number) {
    const body = this.createBody({
      seg: { sx: speed },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/state'), body);
  }

  /** Sets effect intensity. */
  setIntensity(intensity: number) {
    const body = this.createBody({
      seg: { ix: intensity },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/state'), body);
  }

  /** Toggles the LED strip(s) on/off. */
  togglePower(isOn: boolean) {
    const body = this.createBody({ on: isOn });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Toggles the night light timer on/off. */
  toggleNightLight(isNightLightActive: boolean) {
    const body = this.createBody({
      nl: { on: isNightLightActive },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Toggles the night light timer on/off. */
  toggleSync(shouldSync: boolean, shouldToggleReceiveWithSend: boolean) {
    const body = this.createBody({
      udpn: { send: shouldSync },
    });
    if (shouldToggleReceiveWithSend) {
      (body as any /* TODO no any */)['udpn'].recv = shouldSync;
    }
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Selects the specified segment. */
  selectSegment(segmentId: number, isSelected: boolean) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        sel: isSelected,
      },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/state'), body);
  }

  /** Selects the specified segment and deselects all others. */
  selectOnlySegment(segmentId: number, segmentsLength: number) {
    const seg = [];
    for (let i = 0; i < segmentsLength; i++) {
      seg.push({ sel: i === segmentId });
    }
    const body = this.createBody({ seg });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Selects all segments. */
  selectAllSegments(segmentsLength: number) {
    const seg = [];
    for (let i = 0; i < segmentsLength; i++) {
      seg.push({ sel: true });
    }
    const body = this.createBody({ seg });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Updates the core parameters of the specified segment. */
  updateSegment(options: {
    segmentId: number,
    name: string,
    start: number,
    stop: number,
    useSegmentLength: boolean,
    offset?: number,
    grouping?: number,
    spacing?: number,
  }) {
    const calculatedStop = (options.useSegmentLength ? options.start : 0) + options.stop;
    const seg: any /* TODO type */ = {
      id: options.segmentId,
      n: options.name, // TODO is this really needed?
      start: options.start,
      stop: calculatedStop,
    };
    if (options.offset) {
      seg.of = options.offset;
    }
    if (options.grouping) {
      seg.grp = options.grouping;
    }
    if (options.spacing) {
      seg.spc = options.spacing;
    }

    const body = this.createBody({ seg });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Deletes the specified segment. */
  deleteSegment(segmentId: number) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        stop: 0,
      },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/state'), body);
  }

  /** Resets all segments, creating a single segment that covers the entire length of the LED strip. */
  resetSegments(ledCount: number, segmentsLength: number) {
    const segments: Partial<Segment>[] = [];
    segments.push({
      start: 0,
      stop: ledCount,
      sel: true,
    });
    for (let i = 1; i < segmentsLength; i++) {
      segments.push({ stop: 0 });
    }
    const body = this.createBody({ seg: segments });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Toggles the specified segment on or off. */
  setSegmentOn(segmentId: number, isOn: boolean) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        on: isOn,
      },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }
  
  /** Sets the brightness of the specified segment. */
  setSegmentBrightness(segmentId: number, brightness: number) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        bri: brightness,
      },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Toggles the reverse setting of the specified segment. */
  setSegmentReverse(segmentId: number, isReverse: boolean) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        rev: isReverse,
      },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/state'), body);
  }

  /** Toggles the mirror setting of the specified segment. */
  setSegmentMirror(segmentId: number, isMirror: boolean) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        mi: isMirror,
      },
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/state'), body);
  }

  /**
   * Returns list of saved presets, sorted by ID in ascending order.
   * @returns 
   */
  getPresets() {
    const getApiValue = (preset: APIPreset) => {
      const presetCopy: Partial<APIPreset> = { ...preset }
      delete presetCopy.n
      delete presetCopy.ql
      return JSON.stringify(presetCopy)
    }

    const url = this.createApiUrl('presets.json');
    const presets = this.http.get<APIPresets>(url)
      .pipe(
        map((apiPresets: APIPresets) => {
          // delete empty default preset
          delete apiPresets[0];

          // convert presets to list
          const presets: Preset[] = []
          for (const presetId in apiPresets) {
            const preset = apiPresets[presetId]
            presets.push({
              id: parseInt(presetId, 10),
              name: preset.n,
              quickLoadLabel: preset.ql,
              apiValue: getApiValue(preset),
            })
          }

          // sort presets by id ascending
          presets.sort((a: Preset, b: Preset) => a.id - b.id);

          return presets;
        })
      );
    return presets;
  }

  loadPreset(presetId: number) {
    const body = this.createBody({
      ps: presetId,
    });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  savePreset(
    preset: Preset,
    useCurrentState: boolean,
    includeBrightness: boolean,
    saveSegmentBounds: boolean,
    state: AppState,
  ) {
    let request: SavePresetRequest;
    const name = preset.name || `Preset ${preset.id}`;
    let base = {
      psave: preset.id,
      n: name,
      ql: preset.quickLoadLabel,
    };
    if (useCurrentState) {
      request = {
        ...base,
        ib: includeBrightness,
        sb: saveSegmentBounds,
      };
    } else {
      request = {
        ...base,
        ...state,
      };
    }
    const body = this.createBody(request as {});
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/si'), body);
  }

  /** Sets the transition duration. The `transition` unit is 1/10 of a second (eg: `transition = 7` is 0.7s). */
  setTransitionDuration(seconds: number) {
    const body = this.createBody({ transition: seconds * 10 });
    return this.http.post<WledApiResponse>(
      this.createApiUrl('json/state'), body);
  }

  /** Submits LED settings form data to server. */
  setLedSettings(ledSettings: FormValues) {
    return this.http.post<any /* TODO type */>(
      this.createApiUrl(LED_SETTINGS_PATH), ledSettings);
  }

  /** Submits ui settings form data to server. */
  setUISettings(uiSettings: FormValues) {
    return this.http.post<any /* TODO type */>(
      this.createApiUrl(UI_SETTINGS_PATH), uiSettings);
  }

  /** Submits wifi settings form data to server. */
  setWifiSettings(wifiSettings: FormValues) {
    return this.http.post<any /* TODO type */>(
      this.createApiUrl(WIFI_SETTINGS_PATH), wifiSettings);
  }

  private createBody(body: { [key: string]: unknown }) {
    const basicOptions = {
      v: true, // get complete API response
      time: Math.floor(Date.now() / 1000),
    };
    return { ...basicOptions, ...body };
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
