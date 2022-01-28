import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class TopMenuBarService {
  constructor(private apiService: ApiService) { }

  setBrightness(brightness: number) {
    return this.apiService.setBrightness(brightness);
  }

  togglePower(isOn: boolean) {
    return this.apiService.togglePower(isOn);
  }
}
