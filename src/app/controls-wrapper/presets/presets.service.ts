import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberService } from '../../shared/unsubscribing/unsubscriber.service';

export interface Preset {
  id: number;
  name: string;
  quickLoadLabel: string;
  apiValue: string;
}

@Injectable()
export class PresetsService extends UnsubscriberService {
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private appStateService: AppStateService,
  ) {
    super();
  }

  getPresets() {
    const presets = (this.route.snapshot.data['presets'] || []) as Preset[]
    return presets;
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
      .subscribe(({ state }) => {
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
    let min = 1;
    const max = 250; // TODO can this be raised/changed?
    for (const preset of this.getPresets()) {
      if (preset.id === min) {
        min++;
      }
    }
    return Math.min(min, max);
  }
}
