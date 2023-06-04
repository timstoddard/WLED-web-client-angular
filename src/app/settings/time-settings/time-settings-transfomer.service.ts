import { Injectable } from '@angular/core';
import { PickBooleans, PickNonBooleans, TimeSettings, WledTimeSettings, convertToBoolean, convertToString, convertToWledRequestFormat } from '../shared/settings-types';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class TimeSettingsTransformerService {
  /**
   * Converts from API response format.
   */
  transformWledTimeSettingsToTimeSettings = (settings: Partial<WledTimeSettings>): Partial<TimeSettings> => {
    return {
      // TODO
    }
  };

  /**
   * Converts into API response format.
   */
  transformTimeSettingsToWledTimeSettings = (settings: TimeSettings) => {
    // TODO
    // const baseOptions: PickNonBooleans<WledTimeSettings> = {
    // };
    // const booleanOptions: PickBooleans<WledTimeSettings> = {
    // };
    // return convertToWledRequestFormat<WledTimeSettings>(baseOptions, booleanOptions);
    return convertToWledRequestFormat<WledTimeSettings>({}, {});
  };
}
