import { Injectable } from '@angular/core';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { AppPreset } from '../../shared/app-types/app-presets';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { PresetApiService } from 'src/app/shared/api-service/preset-api.service';

@Injectable()
export class PresetsService extends UnsubscriberService {
  private presets: AppPreset[];

  constructor(
    private presetApiService: PresetApiService,
    private appStateService: AppStateService,
  ) {
    super();

    this.presets = [];

    this.appStateService.getPresets(this.ngUnsubscribe)
      .subscribe(presets => {
        this.presets = presets || [];
      });
  }

  getPresets() {
    return this.presets;
  }

  loadPreset(presetId: number) {
    return this.presetApiService.loadPreset(presetId);
  }

  updatePreset(
    preset: AppPreset,
    useCurrentState: boolean,
    includeBrightness: boolean,
    saveSegmentBounds: boolean,
  ) {
    this.appStateService.getAppState(this.ngUnsubscribe)
      .subscribe(({ state }) => {
        // TODO need to return this?
        this.presetApiService.updatePreset(
          preset,
          useCurrentState,
          includeBrightness,
          saveSegmentBounds,
          state);
      });
  }

  togglePresetExpanded(presetId: number) {
    for (const preset of this.presets) {
      if (preset.id === presetId) {
        preset.isExpanded = !preset.isExpanded;
        break;
      }
    }
    this.appStateService.setPresets(this.presets);
  }

  expandAll() {
    for (const preset of this.presets) {
      preset.isExpanded = true;
    }
    this.appStateService.setPresets(this.presets);
  }

  collapseAll() {
    for (const preset of this.presets) {
      preset.isExpanded = false;
    }
    this.appStateService.setPresets(this.presets);
  }

  // TODO better way to keep track of this?
  /**
   * Returns the lowest unused preset ID.
   * @returns 
   */
  getNextPresetId() {
    let min = 1;
    const max = 250; // TODO can this be raised/changed?
    for (const preset of this.presets) {
      if (preset.id === min) {
        min++;
      }
    }
    return Math.min(min, max);
  }
}
