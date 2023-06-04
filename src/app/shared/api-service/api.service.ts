import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, of, timeout } from 'rxjs';
import { ALL_PALETTES_DATA, MOCK_API_PRESETS, MOCK_API_RESPONSE, MOCK_LIVE_DATA, MOCK_NODES_RESPONSE } from '../../controls-wrapper/mock-api-data';
import { PalettesApiData } from '../../controls-wrapper/palettes/palettes.service';
import { WLEDInfo } from '../api-types/api-info';
import { WLEDNodesResponse } from '../api-types/api-nodes';
import { WLEDPresets } from '../api-types/api-presets';
import { WLEDSegment, WLEDState, WLEDUdpState } from '../api-types/api-state';
import { WLEDApiResponse } from '../api-types/api-types';
import { SavePresetRequest, WLEDSegmentPostRequest } from '../api-types/post-requests';
import { NO_DEVICE_IP_SELECTED } from '../app-state/app-state-defaults';
import { AppStateService } from '../app-state/app-state.service';
import { AppPreset } from '../app-types/app-presets';
import { AppWLEDState } from '../app-types/app-state';
import { FormValues } from '../form-service';
import { LiveViewData } from '../live-view/live-view.service';
import { PostResponseHandler } from '../post-response-handler';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import { ApiFilePath, ApiPath } from './api-paths';
import { WledNetworkSettings, WledSecuritySettings } from 'src/app/settings/shared/settings-types';

// TODO split into sub classes per app section and use the ApiService to aggregate their usage
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

  private init = () => {
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

  getBaseUrl = () => {
    return this.baseUrl;
  }

  private setBaseUrl = (baseUrl: string) => {
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
      responseType?: 'json' | 'text' | 'blob',
    } = {},
  ) => {
    const parsedOptions = {
      ...options,
      responseType: responseTypeAsJsonHack(options.responseType),
    }
    if (this.isBaseUrlUnset()) {
      // return fake data
      return of(offlineDefault);
    } else {
      return this.http.get<T>(url, parsedOptions)
        .pipe(catchError(e => {
          // if response can't be loaded, return fake data
          console.warn(`Calling http.get('${url}') failed:`, e);
          return of(offlineDefault);
        }));
    }
  }

  private httpPost = <T = WLEDApiResponse | WLEDState>(
    url: string,
    body: { [key: string]: unknown } | FormData | {},
    offlineDefault: T,
    options: {
      // subset of options for http.post()
      params?: HttpParams,
      responseType?: 'json' | 'text',
    } = {},
  ) => {
    const parsedOptions = {
      ...options,
      responseType: responseTypeAsJsonHack(options.responseType),
    }
    if (this.isBaseUrlUnset()) {
      console.log('MOCK POST:', url, body);
      return of(offlineDefault);
    } else {
      console.log('REAL POST:', url, body);
      return this.http.post<T>(url, body, parsedOptions)
        .pipe(catchError(e => {
          // if response can't be loaded, return fake data
          console.warn(`Calling http.post('${url}') failed:`, e);
          return of(offlineDefault);
        }));
    }
  }

  private createBody = (data: { [key: string]: unknown }) => {
    return {
      v: true, // verbose setting to get full API response
      time: Math.floor(Date.now() / 1000),
      ...data,
    };
  }

  private httpPostStateAndInfo = (data: { [key: string]: unknown }) => {
    return this.httpPost<WLEDApiResponse>(
      this.createApiUrl(ApiPath.STATE_INFO_PATH),
      this.createBody(data),
      MOCK_API_RESPONSE,
    );
  }

  private httpPostState = (data: { [key: string]: unknown }) => {
    return this.httpPost<WLEDState>(
      this.createApiUrl(ApiPath.STATE_PATH),
      this.createBody(data),
      MOCK_API_RESPONSE.state,
    );
  }

  testIpAddressAsBaseUrl = (ipAddress: string) => {
    const TIMEOUT_MS = 3000;
    const FAILED = 'FAILED';
    const url = `http://${ipAddress}/${ApiPath.ALL_JSON_PATH}`;
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
  private refreshAppState = (includePresets = false) => {
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
  private getJson = () => { // TODO rename
    return this.httpGet<WLEDApiResponse>(
      this.createApiUrl(ApiPath.ALL_JSON_PATH),
      MOCK_API_RESPONSE,
    );
  }

  /** Contains the current state of the light. All values may be modified by the client. */
  private getState = () => {
    return this.httpGet<WLEDState>(
      this.createApiUrl(ApiPath.STATE_PATH),
      MOCK_API_RESPONSE.state,
    );
  }

  /** Contains general information about the device. All values are read-only. */
  private getInfo = () => {
    return this.httpGet<WLEDInfo>(
      this.createApiUrl(ApiPath.INFO_PATH),
      MOCK_API_RESPONSE.info,
    );
  }

  /** Contains an array of the effect mode names. */
  private getEffects = () => {
    return this.httpGet<string[]>(
      this.createApiUrl(ApiPath.EFFECTS_PATH),
      MOCK_API_RESPONSE.effects,
    );
  }

  /** Contains an array of the palette names. */
  private getPalettes = () => {
    return this.httpGet<string[]>(
      this.createApiUrl(ApiPath.PALETTES_PATH),
      MOCK_API_RESPONSE.palettes,
    );
  }

  /** Gets palettes data, 8 palettes per page. */
  private getPalettesData = (page: number) => {
    const params = new HttpParams()
      .set('page', page);
    return this.httpGet<PalettesApiData>(
      this.createApiUrl(ApiPath.PALETTES_DATA_PATH),
      ALL_PALETTES_DATA,
      { params },
    );
  }

  /** Gets live data for all LEDs. */
  private getLiveData = () => {
    return this.httpGet<LiveViewData>(
      this.createApiUrl(ApiPath.LIVE_PATH),
      MOCK_LIVE_DATA,
      { responseType: 'text' },
    );
  }

  /** Gets all detected external WLED nodes. */
  private getNodes = () => {
    return this.httpGet<WLEDNodesResponse>(
      this.createApiUrl(ApiPath.NODES_PATH),
      MOCK_NODES_RESPONSE,
    );
  }

  /** Returns dict of saved presets. */
  private getPresets = () => {
    // TODO don't load this when calling a disconnected wled instance
    return this.httpGet<WLEDPresets>(
      this.createApiUrl(ApiFilePath.PRESETS_JSON_FILE),
      MOCK_API_PRESETS,
    );
  }

  /** Sets current palette by id. */
  private setPalette = (paletteId: number) => {
    return this.httpPostStateAndInfo({
      seg: {
        pal: paletteId,
      },
    });
  }

  /** Sets current effect by id. */
  private setEffect = (effectId: number) => {
    return this.httpPostStateAndInfo({
      seg: {
        fx: effectId,
      },
    });
  }

  /** Sets light brightness. */
  private setBrightness = (brightness: number) => {
    return this.httpPostStateAndInfo({
      bri: brightness,
    });
  }

  /** Sets effect speed. */
  private setSpeed = (speed: number) => {
    return this.httpPostState({
      seg: {
        sx: speed,
      },
    });
  }

  /** Sets effect intensity. */
  private setIntensity = (intensity: number) => {
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
  private setColor = (
    r: number,
    g: number,
    b: number,
    w: number,
    slot: number,
  ) => {
    const colors: number[][] = [[], [], []];
    colors[slot] = [r, g, b, w];
    return this.httpPostStateAndInfo({
      seg: {
        col: colors,
      },
    });
  }

  /** Sets white balance. */
  private setWhiteBalance = (whiteBalance: number) => {
    return this.httpPostStateAndInfo({
      seg: {
        cct: whiteBalance,
      },
    });
  }

  /** Sets the live view override setting. */
  private setLiveViewOverride = (liveViewOverride: number) => {
    this.httpPostStateAndInfo({
      lor: liveViewOverride,
    });
  }

  /** Sets the transition duration. The `transition` unit is 1/10 of a second (eg: `transition = 7` is 0.7s). */
  private setTransitionDuration = (seconds: number) => {
    return this.httpPostState({
      transition: seconds * 10,
    });
  }

  /** Toggles the LED strip(s) on/off. */
  private setPower = (isOn: boolean) => {
    return this.httpPostStateAndInfo({
      on: isOn,
    });
  }

  /** Toggles the night light timer on/off. */
  private setNightLightActive = (isNightLightActive: boolean) => {
    return this.httpPostStateAndInfo({
      nl: {
        on: isNightLightActive,
      },
    });
  }

  /** Toggles the night light timer on/off. */
  private setSync = (shouldSync: boolean, shouldToggleReceiveWithSend: boolean) => {
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
  private selectSegment = (segmentId: number, isSelected: boolean) => {
    return this.httpPostState({
      seg: {
        id: segmentId,
        sel: isSelected,
      },
    });
  }

  /** Selects the specified segment and deselects all others. */
  private selectOnlySegment = (segmentId: number, segmentsLength: number) => {
    const segments = [];
    for (let i = 0; i < segmentsLength; i++) {
      segments.push({ sel: i === segmentId });
    }
    return this.httpPostStateAndInfo({
      seg: segments,
    });
  }

  /** Selects all segments. */
  private selectAllSegments = (segmentsLength: number) => {
    const segments = [];
    for (let i = 0; i < segmentsLength; i++) {
      segments.push({ sel: true });
    }
    return this.httpPostStateAndInfo({
      seg: segments,
    });
  }

  /** Creates a new segment. */
  private createSegment = (options: {
    segmentId: number,
    start: number,
    stop: number,
    useSegmentLength: boolean,
  }) => {
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
    // TODO call api here
  }

  /** Updates the specified segment. */
  private updateSegment = (options: {
    segmentId: number,
    start: number,
    stop: number,
    useSegmentLength: boolean,
    offset?: number,
    grouping?: number,
    spacing?: number,
  }) => {
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
  private deleteSegment = (segmentId: number) => {
    return this.httpPostStateAndInfo({
      seg: {
        id: segmentId,
        stop: 0,
      },
    });
  }

  /** Resets all segments, creating a single segment that covers the entire length of the LED strip. */
  private resetSegments = (ledCount: number, segmentsLength: number) => {
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
  private setSegmentOn = (segmentId: number, isOn: boolean) => {
    return this.httpPostStateAndInfo({
      seg: {
        id: segmentId,
        on: isOn,
      },
    });
  }
  
  /** Sets the brightness of the specified segment. */
  private setSegmentBrightness = (segmentId: number, brightness: number) => {
    return this.httpPostStateAndInfo({
      seg: {
        id: segmentId,
        bri: brightness,
      },
    });
  }

  /** Toggles the reverse setting of the specified segment. */
  private setSegmentReverse = (segmentId: number, isReverse: boolean) => {
    return this.httpPostState({
      seg: {
        id: segmentId,
        rev: isReverse,
      },
    });
  }

  /** Toggles the mirror setting of the specified segment. */
  private setSegmentMirror = (segmentId: number, isMirror: boolean) => {
    return this.httpPostState({
      seg: {
        id: segmentId,
        mi: isMirror,
      },
    });
  }

  /** Sets the name of the specified segment. */
  private setSegmentName = (segmentId: number, name: string) => {
    // TODO does this api call work? (probably not but test before deleting)
    return this.httpPostState({
      seg: {
        id: segmentId,
        n: name,
      },
    });
  }
  
  private loadPreset = (presetId: number) => {
    return this.httpPostStateAndInfo({
      ps: presetId,
    });
  }

  private updatePreset = (
    preset: AppPreset,
    useCurrentState: boolean,
    includeBrightness: boolean,
    saveSegmentBounds: boolean,
    state: AppWLEDState,
  ) => {
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

  /** Submits LED settings form data to server. */
  private setLedSettings = (ledSettings: FormValues) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.httpPost(
      this.createApiUrl(ApiPath.LED_SETTINGS_PATH),
      ledSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Submits ui settings form data to server. */
  private setUISettings = (uiSettings: FormValues) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.httpPost(
      this.createApiUrl(ApiPath.UI_SETTINGS_PATH),
      uiSettings,
      MOCK_API_RESPONSE,
    );
  }

  private getNetworkSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.CS.value="wifi network";d.Sf.CP.value="********";d.Sf.I0.value=0;d.Sf.G0.value=0;d.Sf.S0.value=255;d.Sf.I1.value=0;d.Sf.G1.value=0;d.Sf.S1.value=255;d.Sf.I2.value=0;d.Sf.G2.value=0;d.Sf.S2.value=255;d.Sf.I3.value=0;d.Sf.G3.value=0;d.Sf.S3.value=0;d.Sf.CM.value="wled-9518b4";d.Sf.AB.selectedIndex=0;d.Sf.AS.value="WLED-AP";d.Sf.AH.checked=0;d.Sf.AP.value="********";d.Sf.AC.value=1;d.Sf.WS.checked=1;document.getElementById('ethd').style.display='none';d.getElementsByClassName("sip")[0].innerHTML="192.168.100.171";d.getElementsByClassName("sip")[1].innerHTML="4.3.2.1";
      }
    `;
    return this.httpGet(
      this.createApiUrl(ApiFilePath.WIFI_SETTINGS_JS_PATH),
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Submits wifi settings form data to server. */
  private setNetworkSettings = (wifiSettings: Partial<WledNetworkSettings>) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.httpPost(
      this.createApiUrl(ApiPath.WIFI_SETTINGS_PATH),
      wifiSettings,
      MOCK_API_RESPONSE,
    );
  }

  private getSecuritySettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.PIN.value="";d.Sf.NO.checked=0;d.Sf.OW.checked=0;d.Sf.AO.checked=1;
        d.getElementsByClassName("sip")[0].innerHTML="WLED 0.14.0-b1 (build 2212222)";sd="WLED";
      }
    `;
    return this.httpGet(
      this.createApiUrl(ApiFilePath.SECURITY_SETTINGS_JS_PATH),
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Submits security settings form data to server. */
  private setSecuritySettings = (securitySettings: WledSecuritySettings) => {
    // TODO this post doesn't work!!
    return this.httpPost(
      this.createApiUrl(ApiPath.SECURITY_SETTINGS_PATH),
      securitySettings,
      'Security settings saved.',
      { responseType: 'text' },
    );
  }

  /**
   * Uploads a single file to a provided URL.
   * @param file the file to upload
   * @param path the path prefix to upload to
   * @returns post reponse observable
   */
  private uploadFile = (file: File, name: string) => {
    const formData = new FormData();
    formData.append('file', file, name);
    return this.httpPost(
      this.createApiUrl(ApiPath.FILE_UPLOAD_PATH),
      formData,
      MOCK_API_RESPONSE,
      { responseType: 'text' },
    );
  }

  private downloadExternalFile = (url: string) => {
    return this.httpGet(
      url,
      {},
      { responseType: 'blob' },
    );
  }

  private getDownloadPresetsUrl = () => {
    return this.createApiUrl(ApiFilePath.PRESETS_JSON_FILE);
  }

  private getDownloadConfigUrl = () => {
    return this.createApiUrl(ApiFilePath.CONFIG_JSON_FILE);
  }

  appState = {
    refresh: this.refreshAppState,
    brightness: {
      set: this.setBrightness,
    },
    color: {
      set: this.setColor,
    },
    effect: {
      getAll: this.getEffects,
      set: this.setEffect,
    },
    intensity: {
      set: this.setIntensity,
    },
    info: {
      get: this.getInfo,
    },
    json: {
      get: this.getJson,
    },
    liveData: {
      get: this.getLiveData,
    },
    liveViewOverride: {
      set: this.setLiveViewOverride,
    },
    nightLight: {
      set: this.setNightLightActive,
    },
    nodes: {
      get: this.getNodes,
    },
    palette: {
      getAll: this.getPalettes,
      getData: this.getPalettesData,
      set: this.setPalette,
    },
    power: {
      set: this.setPower,
    },
    speed: {
      set: this.setSpeed,
    },
    state: {
      get: this.getState,
    },
    sync: {
      set: this.setSync,
    },
    transitionDuration: {
      set: this.setTransitionDuration,
    },
    whiteBalance: {
      set: this.setWhiteBalance,
    },
  };

  segment = {
    create: this.createSegment,
    update: this.updateSegment,
    delete: this.deleteSegment,
    select: this.selectSegment,
    selectOnly: this.selectOnlySegment,
    selectAll: this.selectAllSegments,
    reset: this.resetSegments,
    setBrightness: this.setSegmentBrightness,
    setMirror: this.setSegmentMirror,
    setName: this.setSegmentName,
    setOn: this.setSegmentOn,
    setReverse: this.setSegmentReverse,
  };

  preset = {
    getAll: this.getPresets,
    load: this.loadPreset,
    update: this.updatePreset,
  };

  settings = {
    leds: {
      get: null, // TODO
      set: this.setLedSettings,
    },
    ui: {
      get: null, // TODO
      set: this.setUISettings,
    },
    network: {
      get: this.getNetworkSettings,
      set: this.setNetworkSettings,
    },
    security: {
      get: this.getSecuritySettings,
      set: this.setSecuritySettings,
    },
  };

  file = {
    upload: this.uploadFile,
    download: {
      internal: null, // TODO
      external: this.downloadExternalFile,
    },
  };

  downloadUrl = {
    presets: this.getDownloadPresetsUrl,
    config: this.getDownloadConfigUrl,
  };
}

/** Workaround for angular http method options responseType bug. */
const responseTypeAsJsonHack = (responseType?: string) =>
  responseType ? responseType as 'json' : 'json'
