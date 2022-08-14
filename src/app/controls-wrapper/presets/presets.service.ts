import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscribingService } from '../../shared/unsubscribing/unsubscribing.service';
import { ControlsServicesModule } from '../controls-services.module';
import { APIPreset } from './presets.api';

export interface Preset {
  id: number;
  name: string;
  quickLoadLabel: string;
  apiValue: string;
}

@Injectable({ providedIn: ControlsServicesModule })
export class PresetsService extends UnsubscribingService {
  private presets: Preset[] = [];

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
  ) {
    super();
  }

  private async fetchPresets() {
    const presets = await firstValueFrom(this.apiService.fetchPresets())
    return presets
  }

  async getPresets(forceUpdate = false): Promise<Preset[]> {
    const shouldUpdate = !this.presets
      || this.presets.length === 0
      || forceUpdate
    if (shouldUpdate) {
      const apiPresets = await this.fetchPresets()
      const presets: Preset[] = []

      const getApiValue = (preset: APIPreset) => {
        const presetCopy: any = { ...preset }
        delete presetCopy.n
        delete presetCopy.ql
        return JSON.stringify(presetCopy)
      }

      for (const presetId in apiPresets) {
        const preset = apiPresets[presetId]
        presets.push({
          id: parseInt(presetId, 10),
          name: preset.n,
          quickLoadLabel: preset.ql,
          apiValue: getApiValue(preset),
        })
      }

      this.presets = presets
      return presets
    }
    return this.presets
  }

  loadPreset(presetId: number) {
    this.apiService.loadPreset(presetId);
  }

  savePreset(
    preset: Preset,
    useCurrentState: boolean,
    includeBrightness: boolean,
    saveSegmentBounds: boolean,
  ) {
    this.appStateService.getAppState(this.ngUnsubscribe)
      .subscribe(state => {
        this.apiService.savePreset(
          preset,
          useCurrentState,
          includeBrightness,
          saveSegmentBounds,
          state);
      });
  }

  // TODO better way to keep track of this?
  /**
   * Returns the lowest unused preset ID.
   * @returns 
   */
  getNextPresetId() {
    let minimum = 1;
    const sortedPresetIds = Object.keys(this.getPresets())
    sortedPresetIds.sort()
    for (const presetId in sortedPresetIds) {
      if (presetId === `${minimum}`) {
        minimum++;
      }
    }
    return minimum > 250 ? 250 : minimum;
  }
}
