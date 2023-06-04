import { Injectable } from '@angular/core';
import { PickBooleans, PickNonBooleans, SecuritySettings, WledSecuritySettings, convertToBoolean, convertToString, convertToWledRequestFormat } from '../shared/settings-types';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class SecuritySettingsTransformerService {
  /**
   * Converts from API response format.
   */
  transformWledSecuritySettingsToSecuritySettings = (settings: Partial<WledSecuritySettings>): Partial<SecuritySettings> => {
    return {
      settingsPin: convertToString(settings.PIN),
      secureWirelessUpdate: convertToBoolean(settings.NO),
      otaUpdatePassword: convertToString(settings.OP),
      denyWifiSettingsAccessIfLocked: convertToBoolean(settings.OW),
      triggerFactoryReset: convertToBoolean(settings.RS),
      enableArduinoOTA: convertToBoolean(settings.AO),
    }
  };

  /**
   * Converts into API response format.
   */
  transformSecuritySettingsToWledSecuritySettings = (settings: SecuritySettings) => {
    const baseOptions: PickNonBooleans<WledSecuritySettings> = {
      PIN: convertToString(settings.settingsPin),
      OP: convertToString(settings.otaUpdatePassword),
    };
    const booleanOptions: PickBooleans<WledSecuritySettings> = {
      NO: settings.secureWirelessUpdate,
      OW: settings.denyWifiSettingsAccessIfLocked,
      RS: settings.triggerFactoryReset,
      AO: settings.enableArduinoOTA,
    };
    return convertToWledRequestFormat<WledSecuritySettings>(baseOptions, booleanOptions);
  };
}
