import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class WifiSettingsService {
  constructor(private apiService: ApiService) {}

  setWifiSettings(wifiSettings: any /* TODO type */) {
    return this.apiService.setWifiSettings(wifiSettings);
  }
}
