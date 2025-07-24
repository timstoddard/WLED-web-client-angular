import { Injectable } from '@angular/core';
import {
  BinaryValue,
  ButtonAction,
  DateTimeScheduledPreset,
  PickBooleans,
  PickNonBooleans,
  ScheduledPreset,
  ScheduledPresetDays,
  SunriseSunsetScheduledPreset,
  TimeSettings,
  WledTimeSettings,
  convertToBoolean,
  convertToString,
  convertToWledRequestFormat,
} from '../shared/settings-types';
import { ParsedMethodCall } from '../shared/api-response-parser.service';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class TimeSettingsTransformerService {
  /**
   * Converts from API response format.
   */
  transformWledTimeSettingsToTimeSettings = (settings: Partial<WledTimeSettings>, methodCalls: ParsedMethodCall[]): Partial<TimeSettings> => {
    const scheduledPresets: ScheduledPreset[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 8; i++) {
      scheduledPresets.push({
        presetId: settings[`T${i}` as keyof WledTimeSettings] as number,
        hour: settings[`H${i}` as keyof WledTimeSettings] as number,
        minute: settings[`N${i}` as keyof WledTimeSettings] as number,
        ...this.readBinarySettings(settings, i),
        startDate: new Date(
          currentYear,
          (settings[`M${i}` as keyof WledTimeSettings] as number) - 1,
          settings[`D${i}` as keyof WledTimeSettings] as number,
        ),
        endDate: new Date(
          currentYear,
          (settings[`P${i}` as keyof WledTimeSettings] as number) - 1,
          settings[`E${i}` as keyof WledTimeSettings] as number,
        ),
      });
    }

    // scheduled preset 8
    const sunrisePreset: SunriseSunsetScheduledPreset = {
      presetId: settings.T8!,
      minute: settings.N8!,
      ...this.readBinarySettings(settings, 8),
    };

    // scheduled preset 9
    const sunsetPreset: SunriseSunsetScheduledPreset = {
      presetId: settings.T9!,
      minute: settings.N9!,
      ...this.readBinarySettings(settings, 9),
    };

    return {
      ntpServer: {
        enabled: convertToBoolean(settings.NT),
        url: convertToString(settings.NS),
      },
      use24HourFormat: convertToBoolean(settings.CF),
      timeZone: settings.TZ,
      utcOffsetSeconds: settings.UO,
      coordinates: {
        longitude: parseFloat(settings.LN!),
        latitude: parseFloat(settings.LT!),
      },
      analogClockOverlay: {
        enabled: convertToBoolean(settings.OL),
        firstLed: settings.O1!,
        lastLed: settings.O2!,
        middleLed: settings.OM!,
        show5MinuteMarks: convertToBoolean(settings.O5),
        showSeconds: convertToBoolean(settings.OS),
        showSolidBlack: convertToBoolean(settings.OB),
      },
      countdown: {
        enabled: convertToBoolean(settings.CE),
        year: settings.CY! < 100
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
      buttonActions: this.getButtonActions(methodCalls),
      scheduledPresets,
      sunrisePreset,
      sunsetPreset,
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
    const buttonActions0 = settings.buttonActions[0] as ButtonAction;
    const buttonActions1 = settings.buttonActions[1] as ButtonAction;
    const buttonActions2 = settings.buttonActions[2] as ButtonAction;
    const buttonActions3 = settings.buttonActions[3] as ButtonAction;

    const baseOptions: PickNonBooleans<WledTimeSettings> = {
      NS: settings.ntpServer.url,
      TZ: settings.timeZone,
      UO: settings.utcOffsetSeconds,
      LN: `${settings.coordinates.longitude}`,
      LT: `${settings.coordinates.latitude}`,
      O1: settings.analogClockOverlay.firstLed,
      O2: settings.analogClockOverlay.lastLed,
      OM: settings.analogClockOverlay.middleLed,
      CY: settings.countdown.year < 100
        ? settings.countdown.year
        : settings.countdown.year - 2000,
      CI: settings.countdown.month,
      CD: settings.countdown.day,
      CH: settings.countdown.hour,
      CM: settings.countdown.minute,
      CS: settings.countdown.second,
      A0: settings.presets.alexaOn,
      A1: settings.presets.alexaOff,
      MC: settings.presets.countdownEnd,
      MN: settings.presets.timerEnd,
      // TODO support additional buttons dynamically
      // Up to 16 buttons with hex value [0-9,A-F]
      // https://github.com/wled/WLED/blob/929a5a8d801e9db691a2d2da6c74dc80105ce8db/wled00/data/settings_time.htm#L92
      MP0: buttonActions0.short,
      ML0: buttonActions0.long,
      MD0: buttonActions0.double,
      MP1: buttonActions1.short,
      ML1: buttonActions1.long,
      MD1: buttonActions1.double,
      MP2: buttonActions2.short,
      ML2: buttonActions2.long,
      MD2: buttonActions2.double,
      MP3: buttonActions3.short,
      ML3: buttonActions3.long,
      MD3: buttonActions3.double,
      H0: scheduledPresets0.hour,
      N0: scheduledPresets0.minute,
      T0: scheduledPresets0.presetId,
      M0: scheduledPresets0.startDate.getMonth() + 1,
      D0: scheduledPresets0.startDate.getDate(),
      P0: scheduledPresets0.endDate.getMonth() + 1,
      E0: scheduledPresets0.endDate.getDate(),
      H1: scheduledPresets1.hour,
      N1: scheduledPresets1.minute,
      T1: scheduledPresets1.presetId,
      M1: scheduledPresets1.startDate.getMonth() + 1,
      D1: scheduledPresets1.startDate.getDate(),
      P1: scheduledPresets1.endDate.getMonth() + 1,
      E1: scheduledPresets1.endDate.getDate(),
      H2: scheduledPresets2.hour,
      N2: scheduledPresets2.minute,
      T2: scheduledPresets2.presetId,
      M2: scheduledPresets2.startDate.getMonth() + 1,
      D2: scheduledPresets2.startDate.getDate(),
      P2: scheduledPresets2.endDate.getMonth() + 1,
      E2: scheduledPresets2.endDate.getDate(),
      H3: scheduledPresets3.hour,
      N3: scheduledPresets3.minute,
      T3: scheduledPresets3.presetId,
      M3: scheduledPresets3.startDate.getMonth() + 1,
      D3: scheduledPresets3.startDate.getDate(),
      P3: scheduledPresets3.endDate.getMonth() + 1,
      E3: scheduledPresets3.endDate.getDate(),
      H4: scheduledPresets4.hour,
      N4: scheduledPresets4.minute,
      T4: scheduledPresets4.presetId,
      M4: scheduledPresets4.startDate.getMonth() + 1,
      D4: scheduledPresets4.startDate.getDate(),
      P4: scheduledPresets4.endDate.getMonth() + 1,
      E4: scheduledPresets4.endDate.getDate(),
      H5: scheduledPresets5.hour,
      N5: scheduledPresets5.minute,
      T5: scheduledPresets5.presetId,
      M5: scheduledPresets5.startDate.getMonth() + 1,
      D5: scheduledPresets5.startDate.getDate(),
      P5: scheduledPresets5.endDate.getMonth() + 1,
      E5: scheduledPresets5.endDate.getDate(),
      H6: scheduledPresets6.hour,
      N6: scheduledPresets6.minute,
      T6: scheduledPresets6.presetId,
      M6: scheduledPresets6.startDate.getMonth() + 1,
      D6: scheduledPresets6.startDate.getDate(),
      P6: scheduledPresets6.endDate.getMonth() + 1,
      E6: scheduledPresets6.endDate.getDate(),
      H7: scheduledPresets7.hour,
      N7: scheduledPresets7.minute,
      T7: scheduledPresets7.presetId,
      M7: scheduledPresets7.startDate.getMonth() + 1,
      D7: scheduledPresets7.startDate.getDate(),
      P7: scheduledPresets7.endDate.getMonth() + 1,
      E7: scheduledPresets7.endDate.getDate(),
      N8: settings.sunrisePreset.minute,
      T8: settings.sunrisePreset.presetId,
      N9: settings.sunsetPreset.minute,
      T9: settings.sunsetPreset.presetId,
      W0: this.writeBinarySettings(scheduledPresets0),
      W1: this.writeBinarySettings(scheduledPresets1),
      W2: this.writeBinarySettings(scheduledPresets2),
      W3: this.writeBinarySettings(scheduledPresets3),
      W4: this.writeBinarySettings(scheduledPresets4),
      W5: this.writeBinarySettings(scheduledPresets5),
      W6: this.writeBinarySettings(scheduledPresets6),
      W7: this.writeBinarySettings(scheduledPresets7),
      W8: this.writeBinarySettings(settings.sunrisePreset),
      W9: this.writeBinarySettings(settings.sunsetPreset),
    };
    const booleanOptions: PickBooleans<WledTimeSettings> = {
      NT: settings.ntpServer.enabled,
      CF: settings.use24HourFormat,
      OL: settings.analogClockOverlay.enabled,
      O5: settings.analogClockOverlay.show5MinuteMarks,
      OS: settings.analogClockOverlay.showSeconds,
      OB: settings.analogClockOverlay.showSolidBlack,
      CE: settings.countdown.enabled,
    };
    console.log('booleanOptions', booleanOptions)
    return convertToWledRequestFormat<WledTimeSettings>(baseOptions, booleanOptions);
  };

  /**
   * Reads the 8 scheduled preset boolean settings that are ANDed into an 8 bit int.
   * 
   * - Bit 1: enabled
   * - Bit 2: Monday enabled
   * - Bit 3: Tuesday enabled
   * - Bit 4: Wednesday enabled
   * - Bit 5: Thursday enabled
   * - Bit 6: Friday enabled
   * - Bit 7: Saturday enabled
   * - Bit 8: Sunday enabled
   * @param settings 
   * @param i index in presets list
   * @returns partial of time settings
   */
  private readBinarySettings(settings: Partial<WledTimeSettings>, i: number) {
    const days = {} as ScheduledPresetDays;

    // 8 boolean settings are ANDed into an 8 bit int (0-255)
    const booleanSettings = settings[`W${i}` as keyof WledTimeSettings] as number;

    // first bit is power, bits 2-8 are days of week (Mon-Sun)
    // gets converted to Sun-Sat for this app
    const enabled = convertToBoolean((booleanSettings & 1) as BinaryValue);
    for (let i = 1; i <= 7; i++) {
      const bit = booleanSettings >> i & 1;
      days[(i % 7) as keyof ScheduledPresetDays] = convertToBoolean(bit as BinaryValue);
    }

    return {
      enabled,
      days,
    };
  }

  /**
   * Converts the 8 scheduled preset boolean settings into an 8 bit int by ANDing them together.
   * 
   * - Bit 1: enabled
   * - Bit 2: Monday enabled
   * - Bit 3: Tuesday enabled
   * - Bit 4: Wednesday enabled
   * - Bit 5: Thursday enabled
   * - Bit 6: Friday enabled
   * - Bit 7: Saturday enabled
   * - Bit 8: Sunday enabled
   * @param scheduledPreset 
   * @returns 
   */
  private writeBinarySettings(scheduledPreset: ScheduledPreset) {
    const {
      enabled,
      days,
    } = scheduledPreset;

    // set first bit from enabled
    let result = enabled ? 1 : 0;
    for (let i = 1; i <= 7; i++) {

      // set bits 2-7 from days
      const bit = ((days[(i % 7) as keyof ScheduledPresetDays] ? 1 : 0));
      result += bit * (1 << i);
    }

    return result;
  }

  private getButtonActions = (methodCalls: ParsedMethodCall[]): ButtonAction[] => {
    const buttonActions: ButtonAction[] = [];
    for (const methodCall of methodCalls) {
      if (methodCall[0] === 'addRow' && methodCall[1]?.length === 4) {
        const values = methodCall[1];
        buttonActions.push({
          index: values[0] as number,
          short: values[1] as number,
          long: values[2] as number,
          double: values[3] as number,
        });
      }
    }
    return buttonActions;
  }
}
