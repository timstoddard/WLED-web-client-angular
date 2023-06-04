import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api-service/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { WLEDIpAddress } from '../../shared/app-types/app-types';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { timer } from 'rxjs';
import { ApiResponseParserService } from '../shared/api-response-parser.service';
import { WIFI_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';
import { NetworkSettings, WledNetworkSettings, getNewParsedValuesSubject } from '../shared/settings-types';
import { NetworkSettingsTransformerService } from './network-settings-transformer.service';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class NetworkSettingsService extends UnsubscriberService {
  /** Store the values from the parsed js file for the initial form values and view rendering. */
  private parsedValues = getNewParsedValuesSubject();

  constructor(
    private apiService: ApiService,
    private apiResponseParserService: ApiResponseParserService,
    private appStateService: AppStateService,
    private networkSettingsTransformerService: NetworkSettingsTransformerService,
  ) {
    super();

    const LOAD_API_URL_DELAY_MS = 2000;
    this.handleUnsubscribe(timer(LOAD_API_URL_DELAY_MS))
      .subscribe(() => {
        this.handleUnsubscribe(this.apiService.settings.network.get())
          .subscribe((responseJs) => {
            const {
              formValues,
              metadata,
            } = this.apiResponseParserService.parseJsFile(responseJs, WIFI_PARSE_CONFIGURATIONS);
            console.log('before transform', formValues)
            console.log('before transform', metadata)
            this.parsedValues.next({
              formValues: this.networkSettingsTransformerService
                .transformWledNetworkSettingsToNetworkSettings(formValues as unknown as WledNetworkSettings),
              metadata,
            });
          });
      });
  }

  getParsedValues() {
    return this.parsedValues;
  }

  setNetworkSettings(settings: NetworkSettings) {
    const wledNetworkSettings = this.networkSettingsTransformerService
      .transformNetworkSettingsToWledNetworkSettings(settings);
    return this.apiService.settings.network.set(wledNetworkSettings);
  }

  /**
   * Sets the client setting of WLED IP addresses on the same network. No backend call is made for this.
   * @param wledIpAddresses ip addresses of WLED devices on the local network, format '123.456.789.123'
   */
  setWLEDIpAddresses(wledIpAddresses: WLEDIpAddress[]) {
    this.appStateService.setLocalSettings({ wledIpAddresses });
  }
}
