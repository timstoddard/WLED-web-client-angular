import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ALL_PALETTES_DATA, MOCK_API_PRESETS, MOCK_API_RESPONSE, MOCK_LIVE_DATA, MOCK_NODES_RESPONSE } from '../../controls-wrapper/mock-api-data';
import { PalettesApiData } from '../../controls-wrapper/palettes/palettes.service';
import { WLEDInfo } from '../api-types/api-info';
import { WLEDNodesResponse } from '../api-types/api-nodes';
import { WLEDPresets } from '../api-types/api-presets';
import { WLEDSegment, WLEDState, WLEDUdpState } from '../api-types/api-state';
import { WLEDApiResponse } from '../api-types/api-types';
import { SavePresetRequest, WLEDSegmentPostRequest } from '../api-types/post-requests';
import { AppPreset } from '../app-types/app-presets';
import { AppWLEDState } from '../app-types/app-state';
import { FormValues } from '../form-service';
import { LiveViewData } from '../live-view/live-view.service';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import { ApiFilePath, ApiPath } from './api-paths';
import { WledNetworkSettings, WledSecuritySettings, WledTimeSettings } from 'src/app/settings/shared/settings-types';
import { HTTP_GET_FAILED, SelectedDeviceService } from '../selected-device.service';
import { responseTypeAsJsonHack } from 'src/app/controls-wrapper/utils';
import { AppStateService } from '../app-state/app-state.service';
import { ApiTypeMapper } from '../api-type-mapper';
import { SnackbarService } from '../snackbar.service';

// TODO split into sub classes per app section and use the ApiService to aggregate their usage
@Injectable({ providedIn: 'root' })
export class ApiService extends UnsubscriberService {
  constructor(
    private http: HttpClient,
    private apiTypeMapper: ApiTypeMapper,
    private appStateService: AppStateService,
    private selectedDeviceService: SelectedDeviceService,
    private snackbarService: SnackbarService,
  ) {
    super();
  }

  getBaseUrl = () => {
    return this.selectedDeviceService.getIpAddress();
  }

  /**
   * Allows for optional base url, to force API path on first page load using IP address from query param.
   * @param path 
   * @param optionalBaseUrl 
   * @returns 
   */
  private createApiUrl = (path: ApiPath | ApiFilePath, optionalBaseUrl?: string) => {
    return optionalBaseUrl
      ? `http://${optionalBaseUrl}/${path}`
      : `http://${this.getBaseUrl()}/${path}`;
  }

  private httpGet = <T>(
    apiPath: ApiPath | ApiFilePath,
    offlineDefault: T,
    options: {
      // subset of options for http.get()
      params?: HttpParams,
      responseType?: 'json' | 'text' | 'blob',
    } = {},
    optionalBaseUrl?: string,
  ) => {
    const url = this.createApiUrl(apiPath, optionalBaseUrl);
    if (
      !optionalBaseUrl
      && this.selectedDeviceService.isNoDeviceSelected()
    ) {
      // return fake data
      return of(offlineDefault);
    } else {
      return this.selectedDeviceService.loadUrlWithTimeout<T>(url, options)
        .pipe(
          map(result => {
            if (result === HTTP_GET_FAILED) {
              console.warn(`HTTP GET '${url}' failed.`);
              return offlineDefault;
            }
            return result;
          }),
          catchError(e => {
            // if response can't be loaded, return fake data
            console.warn(`HTTP GET '${url}' failed:`, e);
            return of(offlineDefault);
          }),
        );
    }
  }

  private httpPost = <T = WLEDApiResponse | WLEDState>(
    apiPath: ApiPath | ApiFilePath,
    body: { [key: string]: unknown } | FormData | {},
    offlineDefault: T,
    options: {
      // subset of options for http.post()
      params?: HttpParams,
      responseType?: 'json' | 'text',
    } = {},
  ) => {
    const url = this.createApiUrl(apiPath);
    const parsedOptions = {
      ...options,
      responseType: responseTypeAsJsonHack(options.responseType),
    }
    if (this.selectedDeviceService.isNoDeviceSelected()) {
      console.log('MOCK POST:', url, body);
      return of(offlineDefault);
    } else {
      console.log('REAL POST:', url, body);
      // TODO add timeout like in httpGet()
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
      ApiPath.STATE_INFO_PATH,
      this.createBody(data),
      MOCK_API_RESPONSE,
    ).pipe(map((response: WLEDApiResponse) => {
      this.appStateService.setAll(response);
      console.log('POST response [state/info]', response);
      
      if (!this.selectedDeviceService.isValidStateInfoResponse(response)) {
        this.snackbarService.openSnackBar('[ERROR] Received invalid JSON API response.');
      }

      return response;
    }));
  }

  private httpPostState = (data: { [key: string]: unknown }) => {
    return this.httpPost<WLEDState>(
      ApiPath.STATE_PATH,
      this.createBody(data),
      MOCK_API_RESPONSE.state,
    ).pipe(map((response: WLEDState) => {
      const newState = this.apiTypeMapper.mapWLEDStateToAppWLEDState(response);
      this.appStateService.updateState(newState);
      console.log('POST response [state]', response);

      if (!this.selectedDeviceService.isValidStateResponse(response)) {
        this.snackbarService.openSnackBar('[ERROR] Received invalid JSON API response.');
      }

      return response;
    }));
  }

  /** Returns an object containing the state, info, effects, and palettes. */
  private getJson = (baseApiUrl?: string) => { // TODO rename
    return this.httpGet<WLEDApiResponse>(
      ApiPath.ALL_JSON_PATH,
      MOCK_API_RESPONSE,
      {},
      baseApiUrl,
    );
  }

  /** Contains the current state of the light. All values may be modified by the client. */
  private getState = () => {
    return this.httpGet<WLEDState>(
      ApiPath.STATE_PATH,
      MOCK_API_RESPONSE.state,
    );
  }

  /** Contains general information about the device. All values are read-only. */
  private getInfo = () => {
    return this.httpGet<WLEDInfo>(
      ApiPath.INFO_PATH,
      MOCK_API_RESPONSE.info,
    );
  }

  /** Contains an array of the effect mode names. */
  private getEffects = () => {
    return this.httpGet<string[]>(
      ApiPath.EFFECTS_PATH,
      MOCK_API_RESPONSE.effects!,
    );
  }

  /** Contains an array of the palette names. */
  private getPalettes = () => {
    return this.httpGet<string[]>(
      ApiPath.PALETTES_PATH,
      MOCK_API_RESPONSE.palettes!,
    );
  }

  /** Gets palettes data, 8 palettes per page. */
  private getPalettesData = (page: number, baseApiUrl?: string) => {
    const params = new HttpParams()
      .set('page', page);
    return this.httpGet<PalettesApiData>(
      ApiPath.PALETTES_DATA_PATH,
      ALL_PALETTES_DATA,
      { params },
      baseApiUrl,
    );
  }

  /** Gets live data for all LEDs. */
  private getLiveData = () => {
    return this.httpGet<LiveViewData>(
      ApiPath.LIVE_PATH,
      MOCK_LIVE_DATA,
      { responseType: 'text' },
    );
  }

  /** Gets all detected external WLED nodes. */
  private getNodes = () => {
    return this.httpGet<WLEDNodesResponse>(
      ApiPath.NODES_PATH,
      MOCK_NODES_RESPONSE,
    );
  }

  /** Returns dict of saved presets. */
  private getPresets = (baseApiUrl?: string) => {
    // TODO don't load this when calling a disconnected wled instance
    return this.httpGet<WLEDPresets>(
      ApiFilePath.PRESETS_JSON_FILE,
      MOCK_API_PRESETS,
      {},
      baseApiUrl,
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

  // TODO this should be used somewhere
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
      ApiPath.LED_SETTINGS_PATH,
      ledSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Submits UI settings form data to server. */
  private setUISettings = (uiSettings: FormValues) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.httpPost(
      ApiPath.UI_SETTINGS_PATH,
      uiSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Reads network settings from the server. */
  private getNetworkSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.CS.value="wifi network";d.Sf.CP.value="********";d.Sf.I0.value=0;d.Sf.G0.value=0;d.Sf.S0.value=255;d.Sf.I1.value=0;d.Sf.G1.value=0;d.Sf.S1.value=255;d.Sf.I2.value=0;d.Sf.G2.value=0;d.Sf.S2.value=255;d.Sf.I3.value=0;d.Sf.G3.value=0;d.Sf.S3.value=0;d.Sf.CM.value="wled-9518b4";d.Sf.AB.selectedIndex=0;d.Sf.AS.value="WLED-AP";d.Sf.AH.checked=0;d.Sf.AP.value="********";d.Sf.AC.value=1;d.Sf.WS.checked=1;document.getElementById('ethd').style.display='none';d.getElementsByClassName("sip")[0].innerHTML="192.168.100.171";d.getElementsByClassName("sip")[1].innerHTML="4.3.2.1";
      }
    `;
    return this.httpGet(
      ApiFilePath.WIFI_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Submits wifi settings form data to server. */
  private setNetworkSettings = (wifiSettings: Partial<WledNetworkSettings>) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.httpPost(
      ApiPath.WIFI_SETTINGS_PATH,
      wifiSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Reads security settings from the server. */
  private getSecuritySettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.PIN.value="";d.Sf.NO.checked=0;d.Sf.OW.checked=0;d.Sf.AO.checked=1;
        d.getElementsByClassName("sip")[0].innerHTML="WLED 0.14.0-b1 (build 2212222)";sd="WLED";
      }
    `;
    return this.httpGet(
      ApiFilePath.SECURITY_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Submits security settings form data to server. */
  private setSecuritySettings = (securitySettings: WledSecuritySettings) => {
    // TODO this post doesn't work!!
    return this.httpPost(
      ApiPath.SECURITY_SETTINGS_PATH,
      securitySettings,
      'Security settings saved.',
      { responseType: 'text' },
    );
  }

  /** Reads time settings from the server. */
  private getTimeSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.NT.checked=0;d.Sf.NS.value="0.wled.pool.ntp.org";d.Sf.CF.checked=1;d.Sf.TZ.selectedIndex=0;d.Sf.UO.value=0;d.Sf.LN.value="0.00";d.Sf.LT.value="0.00";d.getElementsByClassName("times")[0].innerHTML="2023-6-4, 07:57:32";d.Sf.OL.checked=0;d.Sf.O1.value=0;d.Sf.O2.value=29;d.Sf.OM.value=0;d.Sf.OS.checked=0;d.Sf.O5.checked=0;d.Sf.CE.checked=0;d.Sf.CY.value=20;d.Sf.CI.value=1;d.Sf.CD.value=1;d.Sf.CH.value=0;d.Sf.CM.value=0;d.Sf.CS.value=0;d.Sf.A0.value=0;d.Sf.A1.value=0;d.Sf.MC.value=0;d.Sf.MN.value=0;addRow(0,0,0,0);addRow(1,0,0,0);addRow(2,0,0,0);addRow(3,0,0,0);d.Sf.H0.value=0;d.Sf.N0.value=0;d.Sf.T0.value=0;d.Sf.W0.value=255;d.Sf.M0.value=1;d.Sf.P0.value=12;d.Sf.D0.value=1;d.Sf.E0.value=31;d.Sf.H1.value=0;d.Sf.N1.value=0;d.Sf.T1.value=0;d.Sf.W1.value=255;d.Sf.M1.value=1;d.Sf.P1.value=12;d.Sf.D1.value=1;d.Sf.E1.value=31;d.Sf.H2.value=0;d.Sf.N2.value=0;d.Sf.T2.value=0;d.Sf.W2.value=255;d.Sf.M2.value=1;d.Sf.P2.value=12;d.Sf.D2.value=1;d.Sf.E2.value=31;d.Sf.H3.value=0;d.Sf.N3.value=0;d.Sf.T3.value=0;d.Sf.W3.value=255;d.Sf.M3.value=1;d.Sf.P3.value=12;d.Sf.D3.value=1;d.Sf.E3.value=31;d.Sf.H4.value=0;d.Sf.N4.value=0;d.Sf.T4.value=0;d.Sf.W4.value=255;d.Sf.M4.value=1;d.Sf.P4.value=12;d.Sf.D4.value=1;d.Sf.E4.value=31;d.Sf.H5.value=0;d.Sf.N5.value=0;d.Sf.T5.value=0;d.Sf.W5.value=255;d.Sf.M5.value=1;d.Sf.P5.value=12;d.Sf.D5.value=1;d.Sf.E5.value=31;d.Sf.H6.value=0;d.Sf.N6.value=0;d.Sf.T6.value=0;d.Sf.W6.value=255;d.Sf.M6.value=1;d.Sf.P6.value=12;d.Sf.D6.value=1;d.Sf.E6.value=31;d.Sf.H7.value=0;d.Sf.N7.value=0;d.Sf.T7.value=0;d.Sf.W7.value=255;d.Sf.M7.value=1;d.Sf.P7.value=12;d.Sf.D7.value=1;d.Sf.E7.value=31;d.Sf.N8.value=0;d.Sf.T8.value=0;d.Sf.W8.value=255;d.Sf.N9.value=0;d.Sf.T9.value=0;d.Sf.W9.value=255;
      }
    `;
    return this.httpGet(
      ApiFilePath.TIME_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Submits time settings form data to server. */
  private setTimeSettings = (timeSettings: WledTimeSettings) => {
    return this.httpPost(
      ApiPath.TIME_SETTINGS_PATH,
      timeSettings,
      'Time settings saved.',
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
      ApiPath.FILE_UPLOAD_PATH,
      formData,
      MOCK_API_RESPONSE,
      { responseType: 'text' },
    );
  }

  private downloadExternalFile = (url: string) => {
    // TODO implement this (maybe use angular http.get directly)
    // return this.httpGet(
    //   url,
    //   {},
    //   { responseType: 'blob' },
    // );
  }

  private getDownloadPresetsUrl = () => {
    return this.createApiUrl(ApiFilePath.PRESETS_JSON_FILE);
  }

  private getDownloadConfigUrl = () => {
    return this.createApiUrl(ApiFilePath.CONFIG_JSON_FILE);
  }

  appState = {
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
    network: {
      get: this.getNetworkSettings,
      set: this.setNetworkSettings,
    },
    security: {
      get: this.getSecuritySettings,
      set: this.setSecuritySettings,
    },
    time: {
      get: this.getTimeSettings,
      set: this.setTimeSettings,
    },
    ui: {
      get: null, // TODO
      set: this.setUISettings,
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
