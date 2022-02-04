import { Injectable } from '@angular/core';
import { ControlsServicesModule } from '../controls-services.module';

export interface Preset {
  id: number;
  label: string;
  // TODO add other fields
}

@Injectable({ providedIn: ControlsServicesModule })
export class PresetsService {
  getPresets() {
    // TODO get actual preset data (from route resolver)
    return [
      { id: 1, label: 'P1' },
      { id: 2, label: '#2' },
      { id: 3, label: '3!' },
    ] as Preset[];
  }

  loadPreset(presetId: number) {
    // TODO implement
  }
}
