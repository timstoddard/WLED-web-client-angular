import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { BehaviorSubject, timer } from 'rxjs';
import { ApiService } from 'src/app/shared/api-service/api.service';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';

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
const convertToString = (n: unknown) => n ? n.toString() : ''

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

interface SecuritySettingsParsedValues {
  formValues: { [key: string]: unknown },
  metadata: { [key: string]: unknown },
}

@Injectable({ providedIn: 'root' })
export class SecuritySettingsService extends UnsubscriberService {
  readonly PRESETS_FILE_NAME = 'wled_presets.json';
  readonly CONFIG_FILE_NAME = 'wled_cfg.json';
  /** Store the values from the parsed js file for the initial form values and view rendering. */
  private parsedValues = new BehaviorSubject<SecuritySettingsParsedValues>({
    formValues: {},
    metadata: {},
  });

  constructor(
    private apiService: ApiService,
  ) {
    super();

    const LOAD_API_URL_DELAY_MS = 2000;
    timer(LOAD_API_URL_DELAY_MS)
      .subscribe(() => {
        this.handleUnsubscribe(this.apiService.settings.security.get())
          .subscribe(this.parseJsFile);
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

  private parseJsFile = (jsFileText: string) => {
    /*
    function GetV(){
      var d=document;
      d.Sf.PIN.value="";d.Sf.NO.checked=0;d.Sf.OW.checked=0;d.Sf.AO.checked=1;
      d.getElementsByClassName("sip")[0].innerHTML="WLED 0.14.0-b1 (build 2212222)";
      sd="WLED";
    }
    */
    const parseConfigurations = [
      {
        pattern: /d.Sf.PIN.value=([^;]*);/,
        name: 'PIN', // 'settingsPin',
        isMetadata: false,
      },
      {
        pattern: /d.Sf.NO.checked=([^;]*);/,
        name: 'NO', // 'secureWirelessUpdate',
        isMetadata: false,
      },
      {
        pattern: /d.Sf.OW.checked=([^;]*);/,
        name: 'OW', // 'denyWifiSettingsAccessIfLocked',
        isMetadata: false,
      },
      {
        pattern: /d.Sf.AO.checked=([^;]*);/,
        name: 'AO', // 'enableArduinoOTA',
        isMetadata: false,
      },
      {
        pattern: /d\.getElementsByClassName\("sip"\)\[0\]\.innerHTML=([^;]*);/,
        name: 'wledVersion',
        isMetadata: true,
      },
      {
        // TODO what is this used for in original client?
        pattern: /sd=([^;]*);/,
        name: 'sd',
        isMetadata: true,
      },
    ];

    const formValues: { [key: string]: unknown } = {};
    const metadata: { [key: string]: unknown } = {};
    console.log(jsFileText)
    for (const config of parseConfigurations) {
      try {
        const match = jsFileText.match(config.pattern);
        if (match && match[1]) {
          const rawValue = match[1];
          const parsedValue = JSON.parse(rawValue);
          console.log(config.name, '= [', parsedValue, ']')
          const dict = config.isMetadata ? metadata : formValues;
          dict[config.name] = parsedValue;
        }
      } catch (e) {
        console.warn('WARNING: unable to parse saved security settings from API.')
        console.warn(e)
      }
    }

    console.log('before transform', formValues)
    this.parsedValues.next({
      formValues: transformWledSecuritySettingsToSecuritySettings(formValues),
      metadata,
    });
  }
}
