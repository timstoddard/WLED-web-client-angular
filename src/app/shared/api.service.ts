import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, timeout } from 'rxjs';
import { ALL_PALETTES_DATA, MOCK_API_PRESETS, MOCK_API_RESPONSE, MOCK_LIVE_DATA } from '../controls-wrapper/mock-api-data';
import { PalettesApiData } from '../controls-wrapper/palettes/palettes.service';
import { Preset } from '../controls-wrapper/presets/presets.service';
import { APIPreset, APIPresets, SavePresetRequest, WledApiResponse, WledInfo, WledState } from './api-types';
import { NO_DEVICE_IP_SELECTED } from './app-state/app-state-defaults';
import { AppStateService } from './app-state/app-state.service';
import { AppState, Segment } from './app-types';
import { FormValues } from './form-service';
import { LiveViewData } from './live-view/live-view.service';
import { PostResponseHandler } from './post-response-handler';
import { UnsubscriberService } from './unsubscribing/unsubscriber.service';

const ALL_JSON_PATH = 'json';
const STATE_INFO_PATH = 'json/si';
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
export class ApiService extends UnsubscriberService {
  private baseUrl = '';

  constructor(
    private http: HttpClient,
    private appStateService: AppStateService,
    private postResponseHandler: PostResponseHandler,
  ) {
    super();
    this.init();
  }

  private init() {
    this.appStateService.getSelectedWledIpAddress(this.ngUnsubscribe)
      .subscribe(({ ipv4Address }) => {
        this.setBaseUrl(ipv4Address);
        this.refreshAppState();
        console.log('API BASE URL:', this.createApiUrl(''));
      });
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  private setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  isBaseUrlUnset = () => {
    return this.getBaseUrl() === NO_DEVICE_IP_SELECTED.ipv4Address;
  }

  private createApiUrl = (path: string) => {
    return `http://${this.getBaseUrl()}/${path}`;
  }

  private httpGet = <T>(
    url: string,
    offlineDefault: T,
    options: {
      // subset of options for http.get()
      params?: HttpParams,
    } = {},
  ) => {
    if (this.isBaseUrlUnset()) {
      // return fake data
      return of(offlineDefault);
    } else {
      // TODO handle unsubscribe here (post too)
      return this.http.get<T>(url, options);
    }
  }

  private httpPost = <T = WledApiResponse | WledState>(
    url: string,
    body: any,
    offlineDefault: T,
  ) => {
    if (this.isBaseUrlUnset()) {
      console.log('MOCK POST:', url, body);
      return of(offlineDefault);
    } else {
      console.log('REAL POST:', url, body);
      // TODO handle unsubscribe here (get too)
      return this.http.post<T>(url, body);
    }
  }

  private httpPostStateAndInfo = (body: any) => {
    return this.httpPost<WledApiResponse>(
      this.createApiUrl(STATE_INFO_PATH),
      body,
      MOCK_API_RESPONSE,
    );
  }

  private httpPostState = (body: any) => {
    return this.httpPost<WledState>(
      this.createApiUrl(STATES_PATH),
      body,
      MOCK_API_RESPONSE.state,
    );
  }

  testIpAddressAsBaseUrl(ipAddress: string) {
    const TIMEOUT_MS = 3000;
    const FAILED = 'FAILED';
    const url = `http://${ipAddress}/${ALL_JSON_PATH}`;
    const isValidResponse = (result: WledApiResponse) =>
      result.state
      && result.info
      && result.palettes
      && result.effects
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
          } else if (isValidResponse(result)) {
            // it worked
            success = true;
          }

          return { success };
        })
      );
  }

  /** Reload all app data from the backend. */
  private refreshAppState() {
    this.handleUnsubscribe(this.getJson())
      .subscribe(this.postResponseHandler.handleFullJsonResponse());
  }

  /** Returns an object containing the state, info, effects, and palettes. */
  getJson() {
    return this.httpGet<WledApiResponse>(
      this.createApiUrl(ALL_JSON_PATH), MOCK_API_RESPONSE);
  }

  /** Contains the current state of the light. All values may be modified by the client. */
  getState() {
    return this.httpGet<WledState>(
      this.createApiUrl(STATES_PATH), MOCK_API_RESPONSE.state);
  }

  /** Contains general information about the device. All values are read-only. */
  getInfo() {
    return this.httpGet<WledInfo>(
      this.createApiUrl(INFO_PATH), MOCK_API_RESPONSE.info);
  }

  /** Contains an array of the effect mode names. */
  getEffects() {
    return this.httpGet<string[]>(
      this.createApiUrl(EFFECTS_PATH), MOCK_API_RESPONSE.effects);
  }

  /** Contains an array of the palette names. */
  getPalettes() {
    return this.httpGet<string[]>(
      this.createApiUrl(PALETTES_PATH), MOCK_API_RESPONSE.palettes);
  }

  /** Gets palettes data, 8 palettes per page. */
  getPalettesData(page: number) {
    const params = new HttpParams()
      .set('page', page);
    return this.httpGet<PalettesApiData>(
      this.createApiUrl(PALETTES_DATA_PATH), ALL_PALETTES_DATA, { params });
  }

  /** Gets live data for all LEDs. */
  getLiveData() {
    return this.httpGet<LiveViewData>(
      this.createApiUrl(LIVE_PATH), MOCK_LIVE_DATA);
  }

  /** Sets current palette by id. */
  setPalette(paletteId: number) {
    const body = this.createBody({
      seg: { pal: paletteId },
    });
    return this.httpPostStateAndInfo(body);
  }

  /** Sets current effect by id. */
  setEffect(effectId: number) {
    const body = this.createBody({
      seg: { fx: effectId },
    });
    return this.httpPostStateAndInfo(body);
  }

  /** Sets light brightness. */
  setBrightness(brightness: number) {
    const body = this.createBody({ bri: brightness });
    return this.httpPostStateAndInfo(body);
  }

  /** Sets effect speed. */
  setSpeed(speed: number) {
    const body = this.createBody({
      seg: { sx: speed },
    });
    return this.httpPostState(body);
  }

  /** Sets effect intensity. */
  setIntensity(intensity: number) {
    const body = this.createBody({
      seg: { ix: intensity },
    });
    return this.httpPostState(body);
  }

  /** Toggles the LED strip(s) on/off. */
  togglePower(isOn: boolean) {
    const body = this.createBody({ on: isOn });
    return this.httpPostStateAndInfo(body);
  }

  /** Toggles the night light timer on/off. */
  toggleNightLight(isNightLightActive: boolean) {
    const body = this.createBody({
      nl: { on: isNightLightActive },
    });
    return this.httpPostStateAndInfo(body);
  }

  /** Toggles the night light timer on/off. */
  toggleSync(shouldSync: boolean, shouldToggleReceiveWithSend: boolean) {
    const body = this.createBody({
      udpn: { send: shouldSync },
    });
    if (shouldToggleReceiveWithSend) {
      (body as any /* TODO no any */)['udpn'].recv = shouldSync;
    }
    return this.httpPostStateAndInfo(body);
  }

  /** Selects the specified segment. */
  selectSegment(segmentId: number, isSelected: boolean) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        sel: isSelected,
      },
    });
    return this.httpPostState(body);
  }

  /** Selects the specified segment and deselects all others. */
  selectOnlySegment(segmentId: number, segmentsLength: number) {
    const seg = [];
    for (let i = 0; i < segmentsLength; i++) {
      seg.push({ sel: i === segmentId });
    }
    const body = this.createBody({ seg });
    return this.httpPostStateAndInfo(body);
  }

  /** Selects all segments. */
  selectAllSegments(segmentsLength: number) {
    const seg = [];
    for (let i = 0; i < segmentsLength; i++) {
      seg.push({ sel: true });
    }
    const body = this.createBody({ seg });
    return this.httpPostStateAndInfo(body);
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
    return this.httpPostStateAndInfo(body);
  }

  /** Deletes the specified segment. */
  deleteSegment(segmentId: number) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        stop: 0,
      },
    });
    return this.httpPostState(body);
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
    return this.httpPostStateAndInfo(body);
  }

  /** Toggles the specified segment on or off. */
  setSegmentOn(segmentId: number, isOn: boolean) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        on: isOn,
      },
    });
    return this.httpPostStateAndInfo(body);
  }
  
  /** Sets the brightness of the specified segment. */
  setSegmentBrightness(segmentId: number, brightness: number) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        bri: brightness,
      },
    });
    return this.httpPostStateAndInfo(body);
  }

  /** Toggles the reverse setting of the specified segment. */
  setSegmentReverse(segmentId: number, isReverse: boolean) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        rev: isReverse,
      },
    });
    return this.httpPostState(body);
  }

  /** Toggles the mirror setting of the specified segment. */
  setSegmentMirror(segmentId: number, isMirror: boolean) {
    const body = this.createBody({
      seg: {
        id: segmentId,
        mi: isMirror,
      },
    });
    return this.httpPostState(body);
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
    const presets = this.httpGet<APIPresets>(url, MOCK_API_PRESETS)
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
    return this.httpPostStateAndInfo(body);
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
      // TODO create util function to map app state to wled state (and vice versa?)
      const apiState: Partial<WledState> = {
        on: state.on,
        bri: state.brightness,
        transition: state.transition,
        ps: state.currentPresetId,
        pl: state.currentPlaylistId,
        /*nl: {
          on: state.nightLight.on,
          dur: state.nightLight.durationMinutes,
          mode: state.nightLight.mode,
          tbri: state.nightLight.targetBrightness,
          rem: 0, // TODO how to get the actual value?
        },
        udpn: {
          send: state.udp.shouldSend,
          recv: state.udp.shouldReceive,
        },
        lor: state.liveViewOverride,
        mainseg: state.mainSegmentId,
        seg: {}, // WledSegment*/
      };
      request = {
        ...base,
        // TODO make sure this has all the same properties as original app
        ...apiState,
      };
    }
    const body = this.createBody(request as {});
    return this.httpPostStateAndInfo(body);
  }

  /** Sets the transition duration. The `transition` unit is 1/10 of a second (eg: `transition = 7` is 0.7s). */
  setTransitionDuration(seconds: number) {
    const body = this.createBody({ transition: seconds * 10 });
    return this.httpPostState(body);
  }

  /** Submits LED settings form data to server. */
  setLedSettings(ledSettings: FormValues) {
    // TODO does this return WledApiResponse type or other type?
    return this.httpPost(
      this.createApiUrl(LED_SETTINGS_PATH),
      ledSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Submits ui settings form data to server. */
  setUISettings(uiSettings: FormValues) {
    // TODO does this return WledApiResponse type or other type?
    return this.httpPost(
      this.createApiUrl(UI_SETTINGS_PATH),
      uiSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Submits wifi settings form data to server. */
  setWifiSettings(wifiSettings: FormValues) {
    // TODO does this return WledApiResponse type or other type?
    return this.httpPost(
      this.createApiUrl(WIFI_SETTINGS_PATH),
      wifiSettings,
      MOCK_API_RESPONSE,
    );
  }

  private createBody(body: { [key: string]: unknown }) {
    const basicOptions = {
      v: true, // get complete API response
      time: Math.floor(Date.now() / 1000),
    };
    return { ...basicOptions, ...body };
  }




















  

  setLor(lor: number) {
    const body = { lor };
    this.httpPostStateAndInfo(body);
    // this.requestJson(body);
  }

  setBalance(balance: number) {
    const body = {
      seg: { cct: balance },
    };
    this.httpPostStateAndInfo(body);
    // this.requestJson(body);
  }

  // setSi(lor: number) {
  //   const body = { lor };
  //   this.httpPost('/json/si', body);
  //   // this.requestJson(body);
  // }

  // getSi(lor: number) {
  //   const body = { lor };
  //   this.httpPost('/json/si', body);
  //   // this.requestJson(body);
  // }

  getNodes() {
    return this.httpGet<any /* TODO type */>('/json/nodes', {});
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
