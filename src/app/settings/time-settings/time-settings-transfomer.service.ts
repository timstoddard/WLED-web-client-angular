import { Injectable } from '@angular/core';
import { BinaryValue, DateTimeScheduledPreset, PickBooleans, PickNonBooleans, ScheduledPreset, SunriseSunsetScheduledPreset, TimeSettings, WledTimeSettings, convertToBoolean, convertToString, convertToWledRequestFormat } from '../shared/settings-types';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class TimeSettingsTransformerService {
  /**
   * Converts from API response format.
   */
  transformWledTimeSettingsToTimeSettings = (settings: Partial<WledTimeSettings>): Partial<TimeSettings> => {
    const scheduledPresets: ScheduledPreset[] = [];
    const days = {
      sunday: true,    // settings[`W${i}1`]
      monday: true,    // settings[`W${i}2`]
      tuesday: true,   // settings[`W${i}3`]
      wednesday: true, // settings[`W${i}4`]
      thursday: true,  // settings[`W${i}5`]
      friday: true,    // settings[`W${i}6`]
      saturday: true,  // settings[`W${i}7`]
    };

    for (let i = 0; i <= 7; i++) {
      scheduledPresets.push({
        enabled: convertToBoolean(settings[`W${i}` as keyof WledTimeSettings] as BinaryValue),
        presetId: settings[`T${i}` as keyof WledTimeSettings] as number,
        hour: settings[`H${i}` as keyof WledTimeSettings] as number,
        minute: settings[`N${i}` as keyof WledTimeSettings] as number,
        days,
        startDate: {
          month: settings[`M${i}` as keyof WledTimeSettings] as number,
          day: settings[`D${i}` as keyof WledTimeSettings] as number,
        },
        endDate: {
          month: settings[`P${i}` as keyof WledTimeSettings] as number,
          day: settings[`E${i}` as keyof WledTimeSettings] as number,
        },
      });
    }

    // scheduled preset 8
    scheduledPresets.push({
      enabled: convertToBoolean(settings.W8),
      presetId: settings.T8!,
      minute: settings.N8!,
      days,
      type: 'sunrise',
    });

    // scheduled preset 9
    scheduledPresets.push({
      enabled: convertToBoolean(settings.W9),
      presetId: settings.T9!,
      minute: settings.N9!,
      days,
      type: 'sunset',
    });

    return {
      ntpServer: {
        enabled: convertToBoolean(settings.NT),
        url: convertToString(settings.NS),
      },
      use24HourFormat: convertToBoolean(settings.CF),
      timeZone: settings.TZ,
      utcOffsetSeconds: settings.UO,
      coordinates: {
        longitude: parseInt(settings.LN!, 10),
        latitude: parseInt(settings.LT!, 10),
      },
      analogClockOverlay: {
        enabled: convertToBoolean(settings.OL),
        firstLed: settings.O1!,
        lastLed: settings.O2!,
        middleLed: settings.OM!,
        show5MinuteMarks: convertToBoolean(settings.O5),
        showSeconds: convertToBoolean(settings.OS),
      },
      countdown: {
        enabled: convertToBoolean(settings.CE),
        year: settings.CY! / 100 < 1
          ? settings.CY! + 2000
          : settings.CY!,
        month: settings.CI!,
        day: settings.CD!,
        hour: settings.CH!,
        minute: settings.CM!,
        second: settings.CS!,
      },
      presets: {
        alexaOn: settings.A0!,
        alexaOff: settings.A1!,
        countdownEnd: settings.MC!,
        timerEnd: settings.MN!,
      },
      buttonActions: {
        // TODO
      },
      scheduledPresets,
    }
  };

  /**
   * Converts into API response format.
   */
  transformTimeSettingsToWledTimeSettings = (settings: TimeSettings) => {
    const scheduledPresets0 = settings.scheduledPresets[0] as DateTimeScheduledPreset;
    const scheduledPresets1 = settings.scheduledPresets[1] as DateTimeScheduledPreset;
    const scheduledPresets2 = settings.scheduledPresets[2] as DateTimeScheduledPreset;
    const scheduledPresets3 = settings.scheduledPresets[3] as DateTimeScheduledPreset;
    const scheduledPresets4 = settings.scheduledPresets[4] as DateTimeScheduledPreset;
    const scheduledPresets5 = settings.scheduledPresets[5] as DateTimeScheduledPreset;
    const scheduledPresets6 = settings.scheduledPresets[6] as DateTimeScheduledPreset;
    const scheduledPresets7 = settings.scheduledPresets[7] as DateTimeScheduledPreset;
    const scheduledPresets8 = settings.scheduledPresets[8] as SunriseSunsetScheduledPreset;
    const scheduledPresets9 = settings.scheduledPresets[9] as SunriseSunsetScheduledPreset;
    const baseOptions: PickNonBooleans<WledTimeSettings> = {
      NS: settings.ntpServer.url,
      TZ: settings.timeZone,
      UO: settings.utcOffsetSeconds,
      LN: `${settings.coordinates.longitude}`,
      LT: `${settings.coordinates.latitude}`,
      O1: settings.analogClockOverlay.firstLed,
      O2: settings.analogClockOverlay.lastLed,
      OM: settings.analogClockOverlay.middleLed,
      CY: settings.countdown.year,
      CI: settings.countdown.month,
      CD: settings.countdown.day,
      CH: settings.countdown.hour,
      CM: settings.countdown.minute,
      CS: settings.countdown.second,
      A0: settings.presets.alexaOn,
      A1: settings.presets.alexaOff,
      MC: settings.presets.countdownEnd,
      MN: settings.presets.timerEnd,
      H0: scheduledPresets0.hour,
      N0: scheduledPresets0.minute,
      T0: scheduledPresets0.presetId,
      M0: scheduledPresets0.startDate.month,
      P0: scheduledPresets0.startDate.day,
      D0: scheduledPresets0.endDate.month,
      E0: scheduledPresets0.endDate.day,
      H1: scheduledPresets1.hour,
      N1: scheduledPresets1.minute,
      T1: scheduledPresets1.presetId,
      M1: scheduledPresets1.startDate.month,
      P1: scheduledPresets1.startDate.day,
      D1: scheduledPresets1.endDate.month,
      E1: scheduledPresets1.endDate.day,
      H2: scheduledPresets2.hour,
      N2: scheduledPresets2.minute,
      T2: scheduledPresets2.presetId,
      M2: scheduledPresets2.startDate.month,
      P2: scheduledPresets2.startDate.day,
      D2: scheduledPresets2.endDate.month,
      E2: scheduledPresets2.endDate.day,
      H3: scheduledPresets3.hour,
      N3: scheduledPresets3.minute,
      T3: scheduledPresets3.presetId,
      M3: scheduledPresets3.startDate.month,
      P3: scheduledPresets3.startDate.day,
      D3: scheduledPresets3.endDate.month,
      E3: scheduledPresets3.endDate.day,
      H4: scheduledPresets4.hour,
      N4: scheduledPresets4.minute,
      T4: scheduledPresets4.presetId,
      M4: scheduledPresets4.startDate.month,
      P4: scheduledPresets4.startDate.day,
      D4: scheduledPresets4.endDate.month,
      E4: scheduledPresets4.endDate.day,
      H5: scheduledPresets5.hour,
      N5: scheduledPresets5.minute,
      T5: scheduledPresets5.presetId,
      M5: scheduledPresets5.startDate.month,
      P5: scheduledPresets5.startDate.day,
      D5: scheduledPresets5.endDate.month,
      E5: scheduledPresets5.endDate.day,
      H6: scheduledPresets6.hour,
      N6: scheduledPresets6.minute,
      T6: scheduledPresets6.presetId,
      M6: scheduledPresets6.startDate.month,
      P6: scheduledPresets6.startDate.day,
      D6: scheduledPresets6.endDate.month,
      E6: scheduledPresets6.endDate.day,
      H7: scheduledPresets7.hour,
      N7: scheduledPresets7.minute,
      T7: scheduledPresets7.presetId,
      M7: scheduledPresets7.startDate.month,
      P7: scheduledPresets7.startDate.day,
      D7: scheduledPresets7.endDate.month,
      E7: scheduledPresets7.endDate.day,
      N8: scheduledPresets8.minute,
      T8: scheduledPresets8.presetId,
      N9: scheduledPresets9.minute,
      T9: scheduledPresets9.presetId,
    };
    const booleanOptions: PickBooleans<WledTimeSettings> = {
      NT: settings.ntpServer.enabled,
      CF: settings.use24HourFormat,
      OL: settings.analogClockOverlay.enabled,
      O5: settings.analogClockOverlay.show5MinuteMarks,
      OS: settings.analogClockOverlay.showSeconds,
      CE: settings.countdown.enabled,
      W0: settings.scheduledPresets[0].enabled,
      W1: settings.scheduledPresets[1].enabled,
      W2: settings.scheduledPresets[2].enabled,
      W3: settings.scheduledPresets[3].enabled,
      W4: settings.scheduledPresets[4].enabled,
      W5: settings.scheduledPresets[5].enabled,
      W6: settings.scheduledPresets[6].enabled,
      W7: settings.scheduledPresets[7].enabled,
      W8: settings.scheduledPresets[8].enabled,
      W9: settings.scheduledPresets[9].enabled,
    };
    return convertToWledRequestFormat<WledTimeSettings>(baseOptions, booleanOptions);
  };
}
