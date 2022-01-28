import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class EffectsService {
  constructor(private apiService: ApiService) { }

  // TODO is this needed?
  getEffects() {
    return this.apiService.getEffects();
  }

  setEffect(effectId: number) {
    return this.apiService.setEffect(effectId);
  }

  setSpeed(effectId: number) {
    return this.apiService.setSpeed(effectId);
  }

  setIntensity(effectId: number) {
    return this.apiService.setIntensity(effectId);
  }
}
