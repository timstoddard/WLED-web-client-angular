import { Injectable } from '@angular/core';
import { ControlsServicesModule } from '../controls-services.module';

export interface Preset {
  id: number;
  name: string;
  quickLoadLabel: string;
  includeBrightness: boolean;
  saveSegmentBounds: boolean;
  apiCommand: string;
  // TODO add other fields
}

@Injectable({ providedIn: ControlsServicesModule })
export class PresetsService {
  getPresets(): Preset[] {
    // TODO get actual preset data (from route resolver)
    return [
      {
        id: 1,
        name: 'Preset One',
        quickLoadLabel: 'P1',
        includeBrightness: true,
        saveSegmentBounds: true,
        apiCommand: '',
      },
      {
        id: 2,
        name: 'Number 2',
        quickLoadLabel: '#2',
        includeBrightness: true,
        saveSegmentBounds: true,
        apiCommand: '',
      },
      {
        id: 3,
        name: 'Thr33!!!',
        quickLoadLabel: '',
        includeBrightness: true,
        saveSegmentBounds: true,
        apiCommand: '',
      },
    ];
  }

  loadPreset(presetId: number) {
    // TODO implement
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
