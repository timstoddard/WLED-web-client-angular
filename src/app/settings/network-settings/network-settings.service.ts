import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { WledIpAddress } from '../../shared/app-types';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class NetworkSettingsService {
  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
  ) {}

  setWifiSettings(wifiSettings: any /* TODO type */) {
    return this.apiService.setWifiSettings(wifiSettings);
  }

  /**
   * Sets the client setting of WLED IP addresses on the same network. No backend call is made for this.
   * @param wledIpAddresses ip addresses of WLED devices on the local network, format '123.456.789.123'
   */
  setWledIpAddresses(wledIpAddresses: WledIpAddress[]) {
    this.appStateService.setWledIpAddresses(wledIpAddresses);
  }
}
