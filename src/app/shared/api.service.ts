import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, of, timeout } from 'rxjs';
import { ALL_PALETTES_DATA, MOCK_API_PRESETS, MOCK_API_RESPONSE, MOCK_LIVE_DATA, MOCK_NODES_RESPONSE } from '../controls-wrapper/mock-api-data';
import { PalettesApiData } from '../controls-wrapper/palettes/palettes.service';
import { WLEDPresets, SavePresetRequest, WLEDApiResponse, WLEDInfo, WLEDNodesResponse, WLEDSegment, WLEDSegmentPostRequest, WLEDState, WLEDUdpState } from './api-types';
import { NO_DEVICE_IP_SELECTED } from './app-state/app-state-defaults';
import { AppStateService } from './app-state/app-state.service';
import { AppPreset, AppWLEDState } from './app-types';
import { FormValues } from './form-service';
import { LiveViewData } from './live-view/live-view.service';
import { PostResponseHandler } from './post-response-handler';
import { UnsubscriberService } from './unsubscriber/unsubscriber.service';

const ALL_JSON_PATH = 'json';
const STATE_INFO_PATH = 'json/si';
const STATE_PATH = 'json/state';
const INFO_PATH = 'json/info';
const EFFECTS_PATH = 'json/eff';
const PALETTES_PATH = 'json/pal';
const PALETTES_DATA_PATH = 'json/palx';
const LIVE_PATH = 'json/live';
const NODES_PATH = 'json/nodes';

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
    this.appStateService.getLocalSettings(this.ngUnsubscribe)
      .subscribe(({ selectedWLEDIpAddress }) => {
        const { ipv4Address } = selectedWLEDIpAddress;
        this.setBaseUrl(ipv4Address);
        this.refreshAppState(true);
        console.log(
          'API BASE URL:',
          this.getBaseUrl()
            ? this.createApiUrl('')
            : 'n/a',
        );
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
      return this.http.get<T>(url, options)
        .pipe(catchError(e => {
          // if response can't be loaded, return fake data
          console.warn(`Calling http.get('${url}') failed:`, e);
          return of(offlineDefault);
        }));
    }
  }

  private httpPost = <T = WLEDApiResponse | WLEDState>(
    url: string,
    body: { [key: string]: unknown },
    offlineDefault: T,
  ) => {
    if (this.isBaseUrlUnset()) {
      console.log('MOCK POST:', url, body);
      return of(offlineDefault);
    } else {
      console.log('REAL POST:', url, body);
      return this.http.post<T>(url, body);
    }
  }

  private httpPostStateAndInfo = (data: { [key: string]: unknown }) => {
    return this.httpPost<WLEDApiResponse>(
      this.createApiUrl(STATE_INFO_PATH),
      this.createBody(data),
      MOCK_API_RESPONSE,
    );
  }

  private httpPostState = (data: { [key: string]: unknown }) => {
    return this.httpPost<WLEDState>(
      this.createApiUrl(STATE_PATH),
      this.createBody(data),
      MOCK_API_RESPONSE.state,
    );
  }

  testIpAddressAsBaseUrl(ipAddress: string) {
    const TIMEOUT_MS = 3000;
    const FAILED = 'FAILED';
    const url = `http://${ipAddress}/${ALL_JSON_PATH}`;
    const isValidResponse = (result: WLEDApiResponse) =>
      result.state
      && result.info
      && result.palettes
      && result.effects
    return this.http.get<WLEDApiResponse>(url)
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
  refreshAppState(includePresets = false) {
    const apiResponse = forkJoin({
      json: this.getJson(),
      presets: includePresets
        ? this.getPresets()
        : of(undefined),
    });

    this.handleUnsubscribe(apiResponse)
      .subscribe(({
        json,
        presets,
      }) => {
       this.postResponseHandler.handleFullJsonResponse()(json, presets);
      });
  }

  /** Returns an object containing the state, info, effects, and palettes. */
  getJson() {
    return this.httpGet<WLEDApiResponse>(
      this.createApiUrl(ALL_JSON_PATH), MOCK_API_RESPONSE);
  }

  /** Contains the current state of the light. All values may be modified by the client. */
  getState() {
    return this.httpGet<WLEDState>(
      this.createApiUrl(STATE_PATH), MOCK_API_RESPONSE.state);
  }

  /** Contains general information about the device. All values are read-only. */
  getInfo() {
    return this.httpGet<WLEDInfo>(
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

  /** Gets all detected external WLED nodes. */
  getNodes() {
    return this.httpGet<WLEDNodesResponse>(
      this.createApiUrl(NODES_PATH), MOCK_NODES_RESPONSE);
  }

  /** Returns dict of saved presets. */
  getPresets() {
    const url = this.createApiUrl('presets.json');
    // TODO don't load this when calling a disconnected wled instance
    return this.httpGet<WLEDPresets>(url, MOCK_API_PRESETS);
  }

  /** Sets current palette by id. */
  setPalette(paletteId: number) {
    return this.httpPostStateAndInfo({
      seg: {
        pal: paletteId,
      },
    });
  }

  /** Sets current effect by id. */
  setEffect(effectId: number) {
    return this.httpPostStateAndInfo({
      seg: {
        fx: effectId,
      },
    });
  }

  /** Sets light brightness. */
  setBrightness(brightness: number) {
    return this.httpPostStateAndInfo({
      bri: brightness,
    });
  }

  /** Sets effect speed. */
  setSpeed(speed: number) {
    return this.httpPostState({
      seg: {
        sx: speed,
      },
    });
  }

  /** Sets effect intensity. */
  setIntensity(intensity: number) {
    return this.httpPostState({
      seg: {
        ix: intensity,
      },
    });
  }

  /**
   * Updates the current color with the rgbw values.
   * @param r Red channel
   * @param g Green channel
   * @param b Blue channel
   * @param w White channel
   * @param slot Slot to update
   */
  setColor(r: number, g: number, b: number, w: number, slot: number) {
    const colors: number[][] = [[], [], []];
    colors[slot] = [r, g, b, w];
    return this.httpPostStateAndInfo({
      seg: {
        col: colors,
      },
    });
  }

  /** Sets white balance. */
  setWhiteBalance(whiteBalance: number) {
    return this.httpPostStateAndInfo({
      seg: {
        cct: whiteBalance,
      },
    });
  }

  /** Toggles the LED strip(s) on/off. */
  togglePower(isOn: boolean) {
    return this.httpPostStateAndInfo({
      on: isOn,
    });
  }

  /** Toggles the night light timer on/off. */
  toggleNightLight(isNightLightActive: boolean) {
    return this.httpPostStateAndInfo({
      nl: {
        on: isNightLightActive,
      },
    });
  }

  /** Toggles the night light timer on/off. */
  toggleSync(shouldSync: boolean, shouldToggleReceiveWithSend: boolean) {
    const udpn: Partial<WLEDUdpState> = {
      send: shouldSync,
    }
    if (shouldToggleReceiveWithSend) {
      udpn.recv = shouldSync;
    }
    return this.httpPostStateAndInfo({
      udpn,
    });
  }

  /** Selects the specified segment. */
  selectSegment(segmentId: number, isSelected: boolean) {
    return this.httpPostState({
      seg: {
        id: segmentId,
        sel: isSelected,
      },
    });
  }

  /** Selects the specified segment and deselects all others. */
  selectOnlySegment(segmentId: number, segmentsLength: number) {
    const segments = [];
    for (let i = 0; i < segmentsLength; i++) {
      segments.push({ sel: i === segmentId });
    }
    return this.httpPostStateAndInfo({
      seg: segments,
    });
  }

  /** Selects all segments. */
  selectAllSegments(segmentsLength: number) {
    const segments = [];
    for (let i = 0; i < segmentsLength; i++) {
      segments.push({ sel: true });
    }
    return this.httpPostStateAndInfo({
      seg: segments,
    });
  }

  /** Creates a new segment. */
  createSegment(options: {
    segmentId: number,
    start: number,
    stop: number,
    useSegmentLength: boolean,
  }) {
    const {
      segmentId,
      start,
      stop,
      useSegmentLength,
    } = options;
    const result = this.updateSegment({
      segmentId,
      start,
      stop,
      useSegmentLength,
    });
    return result;
  }

  /** Updates the settings of the specified segment. */
  updateSegment(options: {
    segmentId: number,
    start: number,
    stop: number,
    useSegmentLength: boolean,
    offset?: number,
    grouping?: number,
    spacing?: number,
  }) {
    const calculatedStop = (options.useSegmentLength ? options.start : 0) + options.stop;
    const segment: Partial<WLEDSegment> = {
      id: options.segmentId,
      start: options.start,
      stop: calculatedStop,
    };
    if (options.offset) {
      segment.of = options.offset;
    }
    if (options.grouping) {
      segment.grp = options.grouping;
    }
    if (options.spacing) {
      segment.spc = options.spacing;
    }

    return this.httpPostStateAndInfo({
      seg: segment,
    });
  }

  /** Deletes the specified segment. */
  deleteSegment(segmentId: number) {
    return this.httpPostStateAndInfo({
      seg: {
        id: segmentId,
        stop: 0,
      },
    });
  }

  /** Resets all segments, creating a single segment that covers the entire length of the LED strip. */
  resetSegments(ledCount: number, segmentsLength: number) {
    const segments: Partial<WLEDSegmentPostRequest>[] = [];
    segments.push({
      start: 0,
      stop: ledCount,
      sel: true,
    });
    for (let i = 1; i < segmentsLength; i++) {
      segments.push({ stop: 0 });
    }
    return this.httpPostStateAndInfo({
      seg: segments,
    });
  }

  /** Toggles the specified segment on or off. */
  setSegmentOn(segmentId: number, isOn: boolean) {
    return this.httpPostStateAndInfo({
      seg: {
        id: segmentId,
        on: isOn,
      },
    });
  }
  
  /** Sets the brightness of the specified segment. */
  setSegmentBrightness(segmentId: number, brightness: number) {
    return this.httpPostStateAndInfo({
      seg: {
        id: segmentId,
        bri: brightness,
      },
    });
  }

  /** Toggles the reverse setting of the specified segment. */
  setSegmentReverse(segmentId: number, isReverse: boolean) {
    return this.httpPostState({
      seg: {
        id: segmentId,
        rev: isReverse,
      },
    });
  }

  /** Toggles the mirror setting of the specified segment. */
  setSegmentMirror(segmentId: number, isMirror: boolean) {
    return this.httpPostState({
      seg: {
        id: segmentId,
        mi: isMirror,
      },
    });
  }

  /** Sets the name of the specified segment. */
  setSegmentName(segmentId: number, name: string) {
    // TODO does this api call work? (probably not but test before deleting)
    return this.httpPostState({
      seg: {
        id: segmentId,
        n: name,
      },
    });
  }

  loadPreset(presetId: number) {
    return this.httpPostStateAndInfo({
      ps: presetId,
    });
  }

  updatePreset(
    preset: AppPreset,
    useCurrentState: boolean,
    includeBrightness: boolean,
    saveSegmentBounds: boolean,
    state: AppWLEDState,
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
      const apiState: Partial<WLEDState> = {
        // TODO create app to api mapper for this?
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
        seg: {}, // WLEDSegment*/
      };
      request = {
        ...base,
        // TODO make sure this has all the same properties as original app
        ...apiState,
      };
    }
    return this.httpPostStateAndInfo(request as {});
  }

  /** Sets the transition duration. The `transition` unit is 1/10 of a second (eg: `transition = 7` is 0.7s). */
  setTransitionDuration(seconds: number) {
    return this.httpPostState({
      transition: seconds * 10,
    });
  }

  /** Submits LED settings form data to server. */
  setLedSettings(ledSettings: FormValues) {
    // TODO does this return WLEDApiResponse type or other type?
    return this.httpPost(
      this.createApiUrl(LED_SETTINGS_PATH),
      ledSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Submits ui settings form data to server. */
  setUISettings(uiSettings: FormValues) {
    // TODO does this return WLEDApiResponse type or other type?
    return this.httpPost(
      this.createApiUrl(UI_SETTINGS_PATH),
      uiSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Submits wifi settings form data to server. */
  setWifiSettings(wifiSettings: FormValues) {
    // TODO does this return WLEDApiResponse type or other type?
    return this.httpPost(
      this.createApiUrl(WIFI_SETTINGS_PATH),
      wifiSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Sets the live view override setting. */
  setLiveViewOverride(liveViewOverride: number) {
    this.httpPostStateAndInfo({
      lor: liveViewOverride,
    });
  }

  private createBody(data: { [key: string]: unknown }) {
    return {
      v: true, // verbose setting to get full API response
      time: Math.floor(Date.now() / 1000),
      ...data,
    };
  }
}
