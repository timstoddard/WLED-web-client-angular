import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WLEDPresets } from '../api-types/api-presets';
import { ApiFilePath } from './api-paths';
import { MOCK_API_PRESETS } from 'src/app/controls-wrapper/mock-api-data';
import { AppPreset } from '../app-types/app-presets';
import { AppWLEDState } from '../app-types/app-state';
import { SavePresetRequest } from '../api-types/post-requests';
import { WLEDState } from '../api-types/api-state';

@Injectable({ providedIn: 'root' })
export class PresetApiService {
  constructor(
    private apiService: ApiService,
  ) {
  }

  /** Returns dict of saved presets. */
  getPresets = (baseApiUrl?: string) => {
    // TODO don't load this when calling a disconnected wled instance
    return this.apiService.httpGet<WLEDPresets>(
      ApiFilePath.PRESETS_JSON_FILE,
      MOCK_API_PRESETS,
      {},
      baseApiUrl,
    );
  }

  loadPreset = (presetId: number) => {
    return this.apiService.httpPostStateAndInfo({
      ps: presetId,
    });
  }

  updatePreset = (
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
    return this.apiService.httpPostStateAndInfo(request as {});
  }
}
