import { Injectable } from '@angular/core';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { WLEDIpAddress } from '../../shared/app-types/app-types';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { ApiResponseParserService } from '../shared/api-response-parser.service';
import { WIFI_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';
import { NetworkSettings, WledNetworkSettings, getLoadSettingsDelayTimer, getNewParsedValuesSubject } from '../shared/settings-types';
import { NetworkSettingsTransformerService } from './network-settings-transformer.service';
import { SettingsApiService } from 'src/app/shared/api-service/settings-api.service';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class NetworkSettingsService extends UnsubscriberService {
  /** Store the values from the parsed js file for the initial form values and view rendering. */
  private parsedValues = getNewParsedValuesSubject();

  constructor(
    private settingsApiService: SettingsApiService,
    private apiResponseParserService: ApiResponseParserService,
    private appStateService: AppStateService,
    private networkSettingsTransformerService: NetworkSettingsTransformerService,
  ) {
    super();

    this.handleUnsubscribe(getLoadSettingsDelayTimer())
      .subscribe(() => {
        this.handleUnsubscribe(this.settingsApiService.getNetworkSettings())
          .subscribe((responseJs) => {
            const {
              formValues,
              metadata,
            } = this.apiResponseParserService.parseJsFile(responseJs, WIFI_PARSE_CONFIGURATIONS);
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
    return this.settingsApiService.setNetworkSettings(wledNetworkSettings);
  }

  /**
   * Sets the client setting of WLED IP addresses on the same network. No backend call is made for this.
   * @param wledIpAddresses ip addresses of WLED devices on the local network, format '123.456.789.123'
   */
  setWLEDIpAddresses(wledIpAddresses: WLEDIpAddress[]) {
    this.appStateService.setLocalSettings({ wledIpAddresses });
  }
}
