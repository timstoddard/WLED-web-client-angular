import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { MOCK_API_RESPONSE } from '../../controls-wrapper/mock-api-data';
import { WLEDNightLightState, WLEDSegment, WLEDState, WLEDUdpState } from '../api-types/api-state';
import { WLEDApiResponse } from '../api-types/api-types';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import { ApiFilePath, ApiPath } from './api-paths';
import { HTTP_GET_FAILED, SelectedDeviceService } from '../selected-device.service';
import { responseTypeAsJsonHack } from 'src/app/controls-wrapper/utils';
import { AppStateService } from '../app-state/app-state.service';
import { ApiTypeMapper } from '../api-type-mapper';
import { SnackbarService } from '../snackbar.service';
import { WLEDSegmentPostRequest } from '../api-types/post-requests';

// TODO move to post-requests.ts
interface WLEDStatePostRequest {
  seg?: WLEDSegmentPostRequest | Array<WLEDSegmentPostRequest>;
  bri?: number;
  lor?: number;
  transition?: number;
  on?: boolean;
  nl?: Partial<WLEDNightLightState>;
  udpn?: Partial<WLEDUdpState>;
  ps?: number;
  v?: boolean;
  time?: number;
}

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

  httpGet = <T>(
    apiPath: ApiPath | ApiFilePath,
    offlineDefault: T,
    options: {
      // subset of options for http.get()
      params?: HttpParams,
      responseType?: 'json' | 'text' | 'blob',
    } = {},
    optionalBaseUrl?: string,
  ) => {
    const url = this.buildApiUrl(apiPath, optionalBaseUrl);
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

  httpPost = <T = WLEDApiResponse | WLEDState>(
    apiPath: ApiPath | ApiFilePath,
    body: { [key: string]: unknown } | FormData | {},
    offlineDefault: T,
    options: {
      // subset of options for http.post()
      params?: HttpParams,
      responseType?: 'json' | 'text',
      headers?: HttpHeaders,
    } = {},
  ) => {
    const url = this.buildApiUrl(apiPath);
    const parsedOptions = {
      ...options,
      responseType: responseTypeAsJsonHack(options.responseType),
    };
    if (this.selectedDeviceService.isNoDeviceSelected()) {
      console.log('MOCK POST:', url, '\n', body);
      return of(offlineDefault);
    } else {
      console.log('REAL POST:', url, '\n', body);
      // TODO add timeout like in httpGet()
      return this.http.post<T>(url, body, parsedOptions)
        .pipe(catchError(e => {
          // if response can't be loaded, return fake data
          console.warn(`Calling http.post('${url}') failed:`, e);
          return of(offlineDefault);
        }));
    }
  }

  httpPostStateAndInfo = (data: WLEDStatePostRequest) => {
    return this.httpPost<WLEDApiResponse>(
      ApiPath.STATE_INFO_PATH,
      this.buildBody(data),
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

  // TODO can this be deprecated in favor of httpPostStateAndInfo? only used for transition time and segments
  // TODO check for differences in api source code
  httpPostState = (data: WLEDStatePostRequest) => {
    return this.httpPost<WLEDState>(
      ApiPath.STATE_PATH,
      this.buildBody(data),
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

  /**
   * Allows for optional base url, to force API path on first page load using IP address from query param.
   * @param path 
   * @param optionalBaseUrl 
   * @returns 
   */
  buildApiUrl = (path: ApiPath | ApiFilePath, optionalBaseUrl?: string) => {
    const apiBasePath = optionalBaseUrl ?? this.selectedDeviceService.getIpAddress();
    return `http://${apiBasePath}/${path}`;
  }

  private buildBody = (data: WLEDStatePostRequest) => {
    return {
      v: true, // verbose setting to get full API response
      time: Math.floor(Date.now() / 1000),
      ...data,
    } as WLEDStatePostRequest;
  }

  /** Returns an object containing the state, info, effects, and palettes. */
  getJson = (baseApiUrl?: string) => {
    return this.httpGet<WLEDApiResponse>(
      ApiPath.ALL_JSON_PATH,
      MOCK_API_RESPONSE,
      {},
      baseApiUrl,
    );
  }
}
