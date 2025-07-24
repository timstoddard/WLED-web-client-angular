import { Injectable } from '@angular/core';
import { BusSettings, LEDSettings, LedSettings_BusId, PickBooleans, PickNonBooleans, WledLEDSettings, convertToBoolean, convertToString, convertToWledRequestFormat } from '../shared/settings-types';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class LEDSettingsTransformerService {
  /**
   * Converts from API response format.
   */
  transformWledLEDSettingsToLEDSettings = (settings: WledLEDSettings): Partial<LEDSettings> => ({
    autoSegments: convertToBoolean(settings.MS),
    whiteManagement: {
      correctWhiteBalance: convertToBoolean(settings.CCT),
      cctFromRgb: convertToBoolean(settings.CR),
      cctBlending: settings.CB,
      busGlobalAWMode: settings.AW,
    },
    targetFps: settings.FR,
    useLedsArray: convertToBoolean(settings.LD),
    busses: this.transformWledLEDBusSettingsToLEDBusSettings(settings),
    autoBrightnessLimiter: {
      maxMilliamps: settings.MA,
      milliampsPerLed: settings.LA,
    },
    rebootDefaults: {
      brightness: settings.CA,
      on: convertToBoolean(settings.BO),
      preset: settings.BP,
    },
    gammaCorrection: {
      brightness: convertToBoolean(settings.GB),
      color: convertToBoolean(settings.GC),
      value: convertToString(settings.GV),
    },
    transition: {
      fade: convertToBoolean(settings.TF),
      blendEffects: convertToBoolean(settings.EB),
      duration: settings.TD,
      fadePalettes: convertToBoolean(settings.PF),
      randomPaletteChangeTimeSeconds: settings.TP,
    },
    brightnessMultiplier: settings.BF,
    nightLight: {
      targetBrightness: settings.TB,
      delayMinsDefault: settings.TL,
      mode: settings.TW,
    },
    paletteBlendMode: settings.PB,
    gpio: {
      disablePullUp: convertToBoolean(settings.IP),
      touchThreshold: settings.TT,
      relay: {
        pin: settings.RL,
        mode: convertToBoolean(settings.RM),
      },
      IR: {
        pin: settings.IR,
        enabled: settings.IT,
        applyToMainSegmentOnly: convertToBoolean(settings.MSO),
      },
    },
  });

  transformWledLEDBusSettingsToLEDBusSettings = (settings: WledLEDSettings): BusSettings[] => {
    const busses: BusSettings[] = [];
    for (let i = 0; i <= 9; i++) {
      const busId = i as LedSettings_BusId;
      const dataPin = settings[`L0${busId}`];
      const stripLength = settings[`LC${busId}`];
      // simple check to verify the bus exists
      if (typeof dataPin == 'number' && typeof stripLength == 'number') {
        const stripType = settings[`CO${busId}`]!;
        const colorOrder = settings[`LT${busId}`]!;
        const startLed = settings[`LS${busId}`]!;
        const reverse = convertToBoolean(settings[`CV${busId}`]!);
        const skippedLeds = settings[`SL${busId}`]!;
        const isOffRefreshRequired = convertToBoolean(settings[`RF${busId}`]!);
        const autoWhiteMode = settings[`AW${busId}`]!;
        const swapChannels = settings[`WO${busId}`]!;
        const clockSpeed = settings[`SP${busId}`]!;
        busses.push({
          busId,
          dataPin,
          stripLength,
          stripType,
          colorOrder,
          startLed,
          reverse,
          skippedLeds,
          isOffRefreshRequired,
          autoWhiteMode,
          swapChannels,
          clockSpeed,
        });
      }
    }
    return busses;
  }

  /**
   * Converts into API response format.
   */
  transformLEDSettingsToWledLEDSettings = (settings: LEDSettings) => {
    const {
      autoSegments,
      whiteManagement,
      targetFps,
      useLedsArray,
      busses,
      autoBrightnessLimiter,
      rebootDefaults,
      gammaCorrection,
      transition,
      brightnessMultiplier,
      nightLight,
      paletteBlendMode,
      gpio,
    } = settings;

    const baseOptions: PickNonBooleans<WledLEDSettings> = {
      CB: whiteManagement.cctBlending,
      FR: targetFps,
      AW: whiteManagement.busGlobalAWMode,

      // TODO - helper function to build this
      L00: 0,
      LC0: 0,
      LT0: 0,
      CO0: 0,
      LS0: 0,
      SL0: 0,
      AW0: 0,
      WO0: 0,
      SP0: 0,
      //

      MA: autoBrightnessLimiter.maxMilliamps,
      LA: autoBrightnessLimiter.milliampsPerLed,
      CA: rebootDefaults.brightness,
      BP: rebootDefaults.preset,
      GV: gammaCorrection.value,
      TD: transition.duration,
      TP: transition.randomPaletteChangeTimeSeconds,
      BF: brightnessMultiplier,
      TB: nightLight.targetBrightness,
      TL: nightLight.delayMinsDefault,
      TW: nightLight.mode,
      PB: paletteBlendMode,
      RL: gpio.relay.pin,
      TT: gpio.touchThreshold,
      IR: gpio.IR.pin,
      IT: gpio.IR.enabled,
    };
    const booleanOptions: PickBooleans<WledLEDSettings> = {
      MS: autoSegments,
      CCT: whiteManagement.correctWhiteBalance,
      CR: whiteManagement.cctFromRgb,
      LD: useLedsArray,

      // TODO - helper function to build this
      CV0: true,
      RF0: true,
      //

      BO: rebootDefaults.on,
      GB: gammaCorrection.brightness,
      GC: gammaCorrection.color,
      TF: transition.fade,
      EB: transition.blendEffects,
      PF: transition.fadePalettes,
      RM: gpio.relay.mode,
      IP: gpio.disablePullUp,
      MSO: gpio.IR.applyToMainSegmentOnly,
    };
    return convertToWledRequestFormat<WledLEDSettings>(baseOptions, booleanOptions);
  }

  transformLEDBusSettingsToWledLEDBusSettings = (settings: BusSettings[]): Partial<WledLEDSettings> => {
    const result: Partial<WledLEDSettings> = {};
    for (const setting of settings) {
      // TODO
    }
    return result;
  }
}
