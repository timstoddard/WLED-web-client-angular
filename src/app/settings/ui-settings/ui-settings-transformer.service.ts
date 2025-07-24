import { Injectable } from '@angular/core';
import { UISettings, PickBooleans, PickNonBooleans, convertToBoolean, convertToWledRequestFormat, WledUISettings, convertToString } from '../shared/settings-types';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class UISettingsTransformerService {
  /**
   * Converts from API response format.
   */
  transformWledUISettingsToUISettings = (settings: WledUISettings): Partial<UISettings> => ({
    serverDescription: convertToString(settings.DS),
    syncToggleReceive: convertToBoolean(settings.ST),
    simplifiedUI: convertToBoolean(settings.SU),
  })

  /**
   * Converts into API response format.
   */
  transformUISettingsToWledUISettings = (settings: UISettings) => {
    const baseOptions: PickNonBooleans<WledUISettings> = {
      DS: settings.serverDescription,
    };
    const booleanOptions: PickBooleans<WledUISettings> = {
      ST: settings.syncToggleReceive,
      SU: settings.simplifiedUI,
    };
    return convertToWledRequestFormat<WledUISettings>(baseOptions, booleanOptions);
  }
}
