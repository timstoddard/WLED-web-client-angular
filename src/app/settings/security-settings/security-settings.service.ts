import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { BehaviorSubject, timer } from 'rxjs';
import { ApiService } from 'src/app/shared/api-service/api.service';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { ApiResponseParserService, SettingsParsedValues } from '../shared/api-response-parser.service';
import { SECURITY_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';

// TODO move these to proper types file

type BinaryValue = 0 | 1;

export interface SecuritySettings {
  settingsPin: string;
  secureWirelessUpdate: boolean;
  otaUpdatePassword: string;
  denyWifiSettingsAccessIfLocked: boolean;
  triggerFactoryReset: boolean;
  enableArduinoOTA: boolean;
}

export interface WledSecuritySettings {
  /** settingsPin */
  PIN?: string;
  /** secureWirelessUpdate */
  NO?: BinaryValue;
  /** otaUpdatePassword */
  OP?: string;
  /** denyWifiSettingsAccessIfLocked */
  OW?: BinaryValue;
  /** triggerFactoryReset */
  RS?: BinaryValue;
  /** enableArduinoOTA */
  AO?: BinaryValue;
}

const convertToBoolean = (n?: BinaryValue) => !!n;
const convertToString = (n: unknown) => n ? n.toString() : '';

const transformSecuritySettingsToWledSecuritySettings = (settings: SecuritySettings): WledSecuritySettings => {
  const baseOptions: { [key: string]: unknown } = {
    PIN: convertToString(settings.settingsPin),
    OP: convertToString(settings.otaUpdatePassword),
  };
  const otherOptions: { [key: string]: unknown } = {
    NO: settings.secureWirelessUpdate,
    OW: settings.denyWifiSettingsAccessIfLocked,
    RS: settings.triggerFactoryReset,
    AO: settings.enableArduinoOTA,
  };
  for (const optionName in otherOptions) {
    if (otherOptions[optionName]) {
      baseOptions[optionName] = 'on'; // otherOptions[optionName];
    }
  }
  return baseOptions;
};

const transformWledSecuritySettingsToSecuritySettings = (settings: Partial<WledSecuritySettings>): Partial<SecuritySettings> => {
  // console.log('enableArduinoOTA', settings.AO, convertToBoolean(settings.AO))
  return {
    settingsPin: convertToString(settings.PIN),
    secureWirelessUpdate: convertToBoolean(settings.NO),
    otaUpdatePassword: convertToString(settings.OP),
    denyWifiSettingsAccessIfLocked: convertToBoolean(settings.OW),
    triggerFactoryReset: convertToBoolean(settings.RS),
    enableArduinoOTA: convertToBoolean(settings.AO),
  }
};

@Injectable({ providedIn: 'root' })
export class SecuritySettingsService extends UnsubscriberService {
  readonly PRESETS_FILE_NAME = 'wled_presets.json';
  readonly CONFIG_FILE_NAME = 'wled_cfg.json';
  /** Store the values from the parsed js file for the initial form values and view rendering. */
  private parsedValues = new BehaviorSubject<SettingsParsedValues>({
    formValues: {},
    metadata: {},
  });

  constructor(
    private apiService: ApiService,
    private apiResponseParserService: ApiResponseParserService,
  ) {
    super();

    const LOAD_API_URL_DELAY_MS = 2000;
    this.handleUnsubscribe(timer(LOAD_API_URL_DELAY_MS))
      .subscribe(() => {
        this.handleUnsubscribe(this.apiService.settings.security.get())
          .subscribe((responseJs) => {
            const {
              formValues,
              metadata,
            } = this.apiResponseParserService.parseJsFile(responseJs, SECURITY_PARSE_CONFIGURATIONS);
            console.log('before transform', formValues)
            this.parsedValues.next({
              formValues: transformWledSecuritySettingsToSecuritySettings(formValues),
              metadata,
            });
          });
      });
  }

  getParsedValues() {
    return this.parsedValues;
  }

  setSecuritySettings(settings: SecuritySettings) {
    const formValues = transformSecuritySettingsToWledSecuritySettings(settings);
    return this.apiService.settings.security.set(formValues);
  }

  downloadPresetsFile() {
    saveAs(
      this.apiService.downloadUrl.presets(),
      this.PRESETS_FILE_NAME,
    );
  }

  downloadConfigFile() {
    saveAs(
      this.apiService.downloadUrl.config(),
      this.CONFIG_FILE_NAME,
    );
  }
}
