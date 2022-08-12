import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscribingService } from '../../shared/unsubscribing/unsubscribing.service';
import { ControlsServicesModule } from '../controls-services.module';

export interface Preset {
  id: number;
  name: string;
  quickLoadLabel: string;
  apiCommand: string;
}

@Injectable({ providedIn: ControlsServicesModule })
export class PresetsService extends UnsubscribingService {
  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
  ) {
    super();
  }

  getPresets(): Preset[] {
    // TODO get actual preset data (from route resolver)
    return [
      {
        id: 1,
        name: 'Preset One',
        quickLoadLabel: 'P1',
        apiCommand: '',
      },
      {
        id: 2,
        name: 'Number 2',
        quickLoadLabel: '#2',
        apiCommand: '',
      },
      {
        id: 3,
        name: 'Thr33!!!',
        quickLoadLabel: '',
        apiCommand: '',
      },
    ];
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
