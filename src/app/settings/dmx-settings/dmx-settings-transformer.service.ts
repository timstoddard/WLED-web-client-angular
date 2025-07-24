import { Injectable } from '@angular/core';
import { DMXSettings, PickBooleans, PickNonBooleans, convertToBoolean, convertToWledRequestFormat, WledDMXSettings } from '../shared/settings-types';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class DMXSettingsTransformerService {
  /**
   * Converts from API response format.
   */
  transformWledDMXSettingsToDMXSettings = (settings: WledDMXSettings): Partial<DMXSettings> => ({
    e131ProxyUniverse: settings.PU,
    DMXChannels: settings.CN,
    DMXGap: settings.CG,
    DMXStart: settings.CS,
    DMXStartLED: settings.SL,
    channel1: convertToBoolean(settings.CH1),
    channel2: convertToBoolean(settings.CH2),
    channel3: convertToBoolean(settings.CH3),
    channel4: convertToBoolean(settings.CH4),
    channel5: convertToBoolean(settings.CH5),
    channel6: convertToBoolean(settings.CH6),
    channel7: convertToBoolean(settings.CH7),
    channel8: convertToBoolean(settings.CH8),
    channel9: convertToBoolean(settings.CH9),
    channel10: convertToBoolean(settings.CH10),
    channel11: convertToBoolean(settings.CH11),
    channel12: convertToBoolean(settings.CH12),
    channel13: convertToBoolean(settings.CH13),
    channel14: convertToBoolean(settings.CH14),
    channel15: convertToBoolean(settings.CH15),
  })

  /**
   * Converts into API response format.
   */
  transformDMXSettingsToWledDMXSettings = (settings: DMXSettings) => {
    const baseOptions: PickNonBooleans<WledDMXSettings> = {
      PU: settings.e131ProxyUniverse,
      CN: settings.DMXChannels,
      CG: settings.DMXGap,
      CS: settings.DMXStart,
      SL: settings.DMXStartLED,
    };
    const booleanOptions: PickBooleans<WledDMXSettings> = {
      CH1: settings.channel1,
      CH2: settings.channel2,
      CH3: settings.channel3,
      CH4: settings.channel4,
      CH5: settings.channel5,
      CH6: settings.channel6,
      CH7: settings.channel7,
      CH8: settings.channel8,
      CH9: settings.channel9,
      CH10: settings.channel10,
      CH11: settings.channel11,
      CH12: settings.channel12,
      CH13: settings.channel13,
      CH14: settings.channel14,
      CH15: settings.channel15,
    };
    return convertToWledRequestFormat<WledDMXSettings>(baseOptions, booleanOptions);
  }
}
