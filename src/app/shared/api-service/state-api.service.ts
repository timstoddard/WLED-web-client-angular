import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WLEDState, WLEDUdpState } from '../api-types/api-state';
import { ApiPath } from './api-paths';
import { ALL_PALETTES_DATA, MOCK_API_RESPONSE, MOCK_EFFECTS_DATA_RESPONSE, MOCK_LIVE_DATA, MOCK_NODES_RESPONSE } from 'src/app/controls-wrapper/mock-api-data';
import { WLEDNodesResponse } from '../api-types/api-nodes';
import { LiveViewData } from '../live-view/live-view.service';
import { HttpParams } from '@angular/common/http';
import { WLEDPalettesData } from '../api-types/api-palettes';
import { WLEDInfo } from '../api-types/api-info';

@Injectable({ providedIn: 'root' })
export class StateApiService {
  constructor(
    private apiService: ApiService,
  ) {
  }

  /** Contains the current state of the light. All values may be modified by the client. */
  getState = () => {
    return this.apiService.httpGet<WLEDState>(
      ApiPath.STATE_PATH,
      MOCK_API_RESPONSE.state,
    );
  }

  /** Contains general information about the device. All values are read-only. */
  getInfo = () => {
    return this.apiService.httpGet<WLEDInfo>(
      ApiPath.INFO_PATH,
      MOCK_API_RESPONSE.info,
    );
  }

  /** Contains an array of the effect mode names. */
  getEffects = () => {
    return this.apiService.httpGet<string[]>(
      ApiPath.EFFECTS_PATH,
      MOCK_API_RESPONSE.effects!,
    );
  }

  /** Contains configurations for the effects. */
  getEffectData = (baseApiUrl?: string) => {
    return this.apiService.httpGet<string[]>(
      ApiPath.EFFECTS_DATA_PATH,
      MOCK_EFFECTS_DATA_RESPONSE,
      {},
      baseApiUrl,
    );
  }

  /** Contains an array of the palette names. */
  getPalettes = () => {
    return this.apiService.httpGet<string[]>(
      ApiPath.PALETTES_PATH,
      MOCK_API_RESPONSE.palettes!,
    );
  }

  /** Gets palettes data, 8 palettes per page. */
  getPalettesData = (page: number, baseApiUrl?: string) => {
    const params = new HttpParams()
      .set('page', page);
    return this.apiService.httpGet<WLEDPalettesData>(
      ApiPath.PALETTES_DATA_PATH,
      ALL_PALETTES_DATA,
      { params },
      baseApiUrl,
    );
  }

  /** Gets live data for all LEDs. */
  getLiveData = () => {
    return this.apiService.httpGet<LiveViewData>(
      ApiPath.LIVE_PATH,
      MOCK_LIVE_DATA,
      { responseType: 'text' },
    );
  }

  /** Gets all detected external WLED nodes. */
  getNodes = () => {
    return this.apiService.httpGet<WLEDNodesResponse>(
      ApiPath.NODES_PATH,
      MOCK_NODES_RESPONSE,
    );
  }

  /** Sets light brightness. */
  setBrightness = (brightness: number) => {
    return this.apiService.httpPostStateAndInfo({
      bri: brightness,
    });
  }

  // TODO this should be used somewhere
  /** Sets the live view override setting. */
  setLiveViewOverride = (liveViewOverride: number) => {
    this.apiService.httpPostStateAndInfo({
      lor: liveViewOverride,
    });
  }

  /** Sets the transition duration. The `transition` unit is 1/10 of a second (eg: `transition = 7` is 0.7s). */
  setTransitionDuration = (seconds: number) => {
    return this.apiService.httpPostState({
      transition: seconds * 10,
    });
  }

  /** Toggles the LED strip(s) on/off. */
  setPower = (isOn: boolean) => {
    return this.apiService.httpPostStateAndInfo({
      on: isOn,
    });
  }

  /** Toggles the night light on/off. */
  setNightLightActive = (isNightLightActive: boolean) => {
    return this.apiService.httpPostStateAndInfo({
      nl: {
        on: isNightLightActive,
      },
    });
  }

  /** Toggles the sync setting on/off. */
  setSync = (shouldSync: boolean, shouldToggleReceiveWithSend: boolean) => {
    const udpn: Partial<WLEDUdpState> = {
      send: shouldSync,
    }
    if (shouldToggleReceiveWithSend) {
      udpn.recv = shouldSync;
    }
    return this.apiService.httpPostStateAndInfo({
      udpn,
    });
  }

  // !!! TODO need to add all the methods for the new state api fields!
}
