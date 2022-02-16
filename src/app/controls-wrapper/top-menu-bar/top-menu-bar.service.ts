import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class TopMenuBarService {
  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService) { }

  togglePower(isOn: boolean) {
    return this.apiService.togglePower(isOn);
  }

  toggleNightLight(isNightLightActive: boolean) {
    return this.apiService.toggleNightLight(isNightLightActive);
  }

  toggleSync(shouldSync: boolean, shouldToggleReceiveWithSend: boolean) {
    return this.apiService.toggleSync(shouldSync, shouldToggleReceiveWithSend);
  }

  toggleIsLiveViewActive(isLiveViewActive: boolean) {
    this.appStateService.setIsLiveViewActive(isLiveViewActive)
  }

  setBrightness(brightness: number) {
    return this.apiService.setBrightness(brightness);
  }

  setTransitionDuration(seconds: number) {
    return this.apiService.setTransitionDuration(seconds);
  }
}
