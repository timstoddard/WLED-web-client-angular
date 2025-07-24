import { BehaviorSubject, timer } from 'rxjs';
import { SettingsParsedValues } from './api-response-parser.service';

// https://stackoverflow.com/questions/70344859/how-to-filter-an-interface-using-conditional-types-in-typescript
type PickKeysByValueType<T, TYPE> = {
  [K in keyof T]: T[K] extends TYPE ? K : never
}[keyof T];

type PickKeysByNotValueType<T, TYPE> = {
  [K in keyof T]: T[K] extends TYPE ? never : K
}[keyof T];

export type BinaryValue = 0 | 1 | 'on';

// TODO - fix this to throw a TS error when invalid keys are included in the created type
export type PickBooleans<T> = Pick<T, PickKeysByValueType<T, boolean>>;
export type PickNonBooleans<T> = Pick<T, PickKeysByNotValueType<T, BinaryValue>>;

export interface SelectItem<T> {
  name: string;
  value: T;
}

export const convertToBoolean = (n?: BinaryValue) => !!n;

export const convertToString = (n: unknown) => {
  try {
    return n!.toString();
  } catch (e) {
    return '';
  }
};

/**
 * The backend logic uses 'has arg' instead of 'arg value' for boolean (checkbox) form controls. So, any booleans with value false are simply removed.
 * @param baseOptions 
 * @param booleanOptions 
 * @returns 
 */
export const convertToWledRequestFormat = <T>(
  baseOptions: Partial<T>,
  booleanOptions: Partial<T>,
) => {
  for (const optionName in booleanOptions) {
    if (booleanOptions[optionName]) {
      // TODO figure out correct type for this
      baseOptions[optionName] = 'on' as any;
    }
  }
  return baseOptions as T;
};

/**
 * Returns a subject to store the values from a parsed settings js file for the initial form values and view rendering.
 */
export const getNewParsedValuesSubject = () => {
  return new BehaviorSubject<SettingsParsedValues>({
    formValues: {},
    metadata: {},
    methodCalls: [],
  });
}

const LOAD_API_URL_DELAY_MS = 250; // TODO does this need to be increased?
/**
 * Returns a timer to delay before loading settings form values.
 */
export const getLoadSettingsDelayTimer = () => timer(LOAD_API_URL_DELAY_MS);

/**
 * Network settings in app format.
 */
export interface NetworkSettings {
  localNetwork: {
    ssid: string;
    password: string;
    staticIp: string;
    staticGateway: string;
    staticSubnetMask: string;
    mDNS: string;
  };
  wledAccessPoint: {
    ssid: string;
    password: string;
    hideAPName: boolean;
    wifiChannel: number;
    openAP: number;
  };
  disableWifiSleep: boolean;
  ethernetType?: number;
}

/**
 * Network settings in WLED backend format.
 */
export interface WledNetworkSettings {
  /** localNetwork.ssid */
  CS: string;
  /** localNetwork.password */
  CP: string;
  /** localNetwork.staticIp (block 1/4) */
  I0: number;
  /** localNetwork.staticIp (block 2/4) */
  I1: number;
  /** localNetwork.staticIp (block 3/4) */
  I2: number;
  /** localNetwork.staticIp (block 4/4) */
  I3: number;
  /** localNetwork.staticGateway (block 1/4) */
  G0: number;
  /** localNetwork.staticGateway (block 2/4) */
  G1: number;
  /** localNetwork.staticGateway (block 3/4) */
  G2: number;
  /** localNetwork.staticGateway (block 4/4) */
  G3: number;
  /** localNetwork.staticSubnetMask (block 1/4) */
  S0: number;
  /** localNetwork.staticSubnetMask (block 2/4) */
  S1: number;
  /** localNetwork.staticSubnetMask (block 3/4) */
  S2: number;
  /** localNetwork.staticSubnetMask (block 4/4) */
  S3: number;
  /** localNetwork.mDNS */
  CM: string;
  /** wledAccessPoint.ssid */
  AS: string;
  /** wledAccessPoint.password */
  AP: string;
  /** wledAccessPoint.hideAPName */
  AH: BinaryValue;
  /** wledAccessPoint.wifiChannel */
  AC: number;
  /** wledAccessPoint.openAP */
  AB: number;
  /** disableWifiSleep */
  WS: BinaryValue;
  /** ethernetType. Not included in response for WIFI controllers. */
  ETH?: number;
}

// TODO double check all names
// TODO create sub objects for related fields
export interface LEDSettings {
  /** Make a segment for each output. */
  autoSegments: boolean;
  whiteManagement: {
    correctWhiteBalance: boolean;
    cctFromRgb: boolean;
    cctBlending: number;
    busGlobalAWMode: number;
  }
  targetFps: number;
  useLedsArray: boolean;
  busses: BusSettings[];
  autoBrightnessLimiter: {
    maxMilliamps: number;
    milliampsPerLed: number;
  }
  rebootDefaults: {
    brightness: number;
    on: boolean;
    preset: number;
  }
  gammaCorrection: {
    brightness: boolean;
    color: boolean;
    value: string;
  }
  transition: {
    fade: boolean;
    blendEffects: boolean;
    duration: number;
    fadePalettes: boolean;
    randomPaletteChangeTimeSeconds: number;
  }
  brightnessMultiplier: number;
  nightLight: {
    targetBrightness: number;
    delayMinsDefault: number;
    mode: number;
  }
  paletteBlendMode: number;
  gpio: {
    disablePullUp: boolean;
    touchThreshold: number;
    relay: {
      pin: number;
      mode: boolean;
    }
    IR: {
      pin: number;
      enabled: number;
      applyToMainSegmentOnly: boolean;
    }
  }
}

// TODO verify types
export interface BusSettings {
  busId: number; // 0 - 9
  dataPin: number;
  stripLength: number;
  stripType: number;
  colorOrder: number;
  startLed: number;
  reverse: boolean;
  skippedLeds: number;
  isOffRefreshRequired: boolean;
  autoWhiteMode: number;
  swapChannels: number;
  clockSpeed: number;
}

// TODO - include read only values in this interface? are they used in the form
export type WledLEDSettings = {
  /** autoSegments */
  MS: BinaryValue;
  /** whiteManagement.correctWhiteBalance */
  CCT: BinaryValue;
  /** whiteManagement.cctFromRgb */
  CR: BinaryValue;
  /** whiteManagement.cctBlending */
  CB: number;
  /** targetFps */
  FR: number;
  /** whiteManagement.busGlobalAWMode */
  AW: number;
  /** useLedsArray */
  LD: BinaryValue;
  /** autoBrightnessLimiter.maxMilliamps */
  MA: number;
  /** autoBrightnessLimiter.milliampsPerLed */
  LA: number;
  /** rebootDefaults.brightness */
  CA: number;
  /** rebootDefaults.on */
  BO: BinaryValue;
  /** rebootDefaults.preset */
  BP: number;
  /** gammaCorrection.brightness */
  GB: BinaryValue;
  /** gammaCorrection.color */
  GC: BinaryValue;
  /** gammaCorrection.value */
  GV: string;
  /** transition.fade */
  TF: BinaryValue;
  /** transition.blendEffects */
  EB: BinaryValue;
  /** transition.duration */
  TD: number;
  /** transition.fadePalettes */
  PF: BinaryValue;
  /** transition.randomPaletteChangeTimeSeconds */
  TP: number;
  /** brightnessMultiplier */
  BF: number;
  /** nightLight.targetBrightness */
  TB: number;
  /** nightLight.delayMinsDefault */
  TL: number;
  /** nightLight.mode */
  TW: number;
  /** paletteBlendMode */
  PB: number;
  /** gpio.relay.pin */
  RL: number;
  /** gpio.relay.mode */
  RM: BinaryValue;
  /** gpio.disablePullUp */
  IP: BinaryValue;
  /** gpio.touchThreshold */
  TT: number;
  /** gpio.IR.pin */
  IR: number;
  /** gpio.IR.enabled */
  IT: number;
  /** gpio.IR.applyToMainSegmentOnly */
  MSO: BinaryValue;
}
/** bus.dataPin */
& { [key in `L0${LedSettings_BusId}`]?: number; }
/** bus.stripLength */
& { [key in `LC${LedSettings_BusId}`]?: number; }
/** bus.stripType */
& { [key in `CO${LedSettings_BusId}`]?: number; }
/** bus.colorOrder */
& { [key in `LT${LedSettings_BusId}`]?: number; }
/** bus.startLed */
& { [key in `LS${LedSettings_BusId}`]?: number; }
/** bus.reverse */
& { [key in `CV${LedSettings_BusId}`]?: BinaryValue; }
/** bus.skippedLeds */
& { [key in `SL${LedSettings_BusId}`]?: number; }
/** bus.isOffRefreshRequired */
& { [key in `RF${LedSettings_BusId}`]?: BinaryValue; }
/** bus.autoWhiteMode */
& { [key in `AW${LedSettings_BusId}`]?: number; }
/** bus.swapChannels */
& { [key in `WO${LedSettings_BusId}`]?: number; }
/** bus.clockSpeed */
& { [key in `SP${LedSettings_BusId}`]?: number; };

export type LedSettings_BusId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * UI settings in app format.
 */
export interface UISettings {
  serverDescription: string;
  syncToggleReceive: boolean;
  simplifiedUI: boolean;
}

/**
 * UI settings in WLED format.
 */
export interface WledUISettings {
  /** serverDescription */
  DS: string;
  /** syncToggleReceive */
  ST: BinaryValue;
  /** simplifiedUI */
  SU: BinaryValue;
}

/**
 * Sync settings in app format.
 */
export interface SyncSettings {
  broadcast: {
    udpPort: number;
    udpPort2: number;
  };
  groups: {
    /** sync groups this instance syncs (bit mapped) */
    syncGroups: number;
    /** sync receive groups this instance belongs to (bit mapped) */
    receiveGroups: number;
    receiveNotificationBrightness: boolean;
    receiveNotificationColor: boolean;
    receiveNotificationEffects: boolean;
    receiveSegmentOptions: boolean;
    receiveSegmentBounds: boolean;
    notifyDirectDefault: boolean;
    notifyButton: boolean;
    notifyAlexa: boolean;
    notifyHue: boolean;
    notifyMacro: boolean;
    udpRetries: number;
  };
  instanceList: {
    enabled: boolean;
    broadcastEnabled: boolean;
  };
  realtime: {
    receiveUDP: boolean;
    useMainSegmentOnly: boolean;
    e131Port: number;
    e131SkipOutOfSequence: boolean;
    e131Multicast: boolean;
    e131Universe: number;
    DMXAddress: number;
    DMXSegmentSpacing: number;
    e131Priority: number;
    DMXMode: number;
    timeoutMs: number;
    forceMaxBrightness: boolean;
    disableGammaCorrection: boolean;
    ledOffset: number;
  };
  alexa: {
    enabled: boolean;
    invocationName: number;
    presetCount: number;
  };
  mqtt: {
    enabled: boolean;
    server: string;
    port: number;
    user: string;
    password: string;
    clientId: string;
    deviceTopic: string;
    groupTopic: string;
    buttonPublish: boolean;
    /** retain brightness and color */
    retainMessage: boolean;
  };
  hue: {
    ipAddress: string;
    pollLightId: number;
    pollIntervalMs: number;
    pollingEnabled: boolean;
    applyOnOff: boolean;
    applyBrightness: boolean;
    applyColor: boolean;
  };
  /** Baud Rate https://www.setra.com/blog/what-is-baud-rate-and-what-cable-length-is-required-1 */
  serialBaudRate: number;
}

/**
 * Sync settings in WLED format.
 */
export interface WledSyncSettings {
  /** broadcast.udpPort */
  UP: number;
  /** broadcast.udpPort2 */
  U2: number;
  /** groups.syncGroups */
  GS: number;
  /** groups.receiveGroups */
  GR: number;
  /** groups.receiveNotificationBrightness */
  RB: BinaryValue;
  /** groups.receiveNotificationColor */
  RC: BinaryValue;
  /** groups.receiveNotificationEffects */
  RX: BinaryValue;
  /** groups.receiveSegmentOptions */
  SO: BinaryValue;
  /** groups.receiveSegmentBounds */
  SG: BinaryValue;
  /** groups.notifyDirectDefault */
  SD: BinaryValue;
  /** groups.notifyButton */
  SB: BinaryValue;
  /** groups.notifyHue */
  SH: BinaryValue;
  /** groups.notifyMacro */
  SM: BinaryValue;
  /** groups.udpRetries */
  UR: number;
  /** instanceList.enabled */
  NL: BinaryValue;
  /** instanceList.broadcastEnabled */
  NB: BinaryValue;
  /** realtime.receiveUDP */
  RD: BinaryValue;
  /** realtime.useMainSegmentOnly */
  MO: BinaryValue;
  /** realtime.e131Port */
  EP: number;
  /** realtime.e131SkipOutOfSequence */
  ES: BinaryValue;
  /** realtime.e131Multicast */
  EM: BinaryValue;
  /** realtime.e131Universe */
  EU: number;
  /** realtime.DMXAddress */
  DA: number;
  /** realtime.DMXSegmentSpacing */
  XX: number;
  /** realtime.e131Priority */
  PY: number;
  /** realtime.DMXMode */
  DM: number;
  /** realtime.timeoutMs */
  ET: number;
  /** realtime.forceMaxBrightness */
  FB: BinaryValue;
  /** realtime.disableGammaCorrection */
  RG: BinaryValue;
  /** realtime.ledOffset */
  WO: number;
  /** alexa.enabled */
  AL: BinaryValue;
  /** alexa.invocationName */
  AI: number;
  /** groups.notifyAlexa */
  SA: BinaryValue;
  /** alexa.presetCount */
  AP: number;
  
  // optional - only included if MQTT is enabled
  /** mqtt.enabled */
  MQ: BinaryValue;
  /** mqtt.server */
  MS: number;
  /** mqtt.port */
  MQPORT: number;
  /** mqtt.user */
  MQUSER: number;
  /** mqtt.password */
  MQPASS: number;
  /** mqtt.clientId */
  MQCID: number;
  /** mqtt.deviceTopic */
  MD: number;
  /** mqtt.groupTopic */
  MG: number;
  /** mqtt.buttonPublish */
  BM: BinaryValue;
  /** mqtt.retainMessage */
  RT: BinaryValue;
  //////////////////////////////////////////////

  // optional - only included if Hue is enabled
  /** hue.ipAddress (part 1) */
  H0: number;
  /** hue.ipAddress (part 2) */
  H1: number;
  /** hue.ipAddress (part 3) */
  H2: number;
  /** hue.ipAddress (part 4) */
  H3: number;
  /** hue.pollLightId */
  HL: number;
  /** hue.pollIntervalMs */
  HI: number;
  /** hue.pollingEnabled */
  HP: BinaryValue;
  /** hue.applyOnOff */
  HO: BinaryValue;
  /** hue.applyBrightness */
  HB: BinaryValue;
  /** hue.applyColor */
  HC: BinaryValue;
  //////////////////////////////////////////////

  /** serialBaudRate */
  BD: number;
}

/**
 * Time settings in app format.
 */
export interface TimeSettings {
  ntpServer: {
    enabled: boolean;
    url: string;
  };
  use24HourFormat: boolean;
  timeZone: number;
  utcOffsetSeconds: number;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  analogClockOverlay: {
    enabled: boolean;
    firstLed: number;
    lastLed: number;
    middleLed: number;
    show5MinuteMarks: boolean;
    showSeconds: boolean;
    showSolidBlack: boolean;
  };
  countdown: {
    enabled: boolean;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  presets: {
    alexaOn: number;
    alexaOff: number;
    countdownEnd: number;
    timerEnd: number;
  };
  buttonActions: ButtonAction[];
  scheduledPresets: ScheduledPreset[];
  sunrisePreset: ScheduledPreset;
  sunsetPreset: ScheduledPreset;
}

export interface ButtonAction {
  index: number;
  short: number;
  long: number;
  double: number;
}

interface ScheduledPresetBase {
  enabled: boolean;
  presetId: number;
  minute: number;
  days: ScheduledPresetDays;
}

export interface ScheduledPresetDays {
  0: boolean;
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
  5: boolean;
  6: boolean;
}

/**
 * Preset that is turned on at specific dates and times.
 */
export interface DateTimeScheduledPreset extends ScheduledPresetBase {
  hour: number;
  startDate: Date;
  endDate: Date;
}

/**
 * Preset that is turned on at sunrise or sunset.
 */
export interface SunriseSunsetScheduledPreset extends ScheduledPresetBase {
  // type: 'sunset' | 'sunrise';
}

/**
 * Preset that is turned on according to a schedule.
 */
export type ScheduledPreset = DateTimeScheduledPreset | SunriseSunsetScheduledPreset;

/**
 * Time settings in WLED backend format.
 */
export interface WledTimeSettings {
  /** ntpServer.enabled */
  NT: BinaryValue;
  /** ntpServer.url */
  NS: string;
  /** use24HourFormat */
  CF: BinaryValue;
  /** timeZone */
  TZ: number;
  /** utcOffsetSeconds */
  UO: number;
  /** longitude */
  LN: string; // TODO need to allow for number in post request
  /** latitude */
  LT: string; // TODO need to allow for number in post request
  /** analogClockOverlay.enabled */
  OL: BinaryValue;
  /** analogClockOverlay.firstLed */
  O1: number;
  /** analogClockOverlay.lastLed */
  O2: number;
  /** analogClockOverlay.hour12Led */
  OM: number;
  /** analogClockOverlay.showSeconds */
  OS: BinaryValue;
  /** analogClockOverlay.show5MinuteMarks */
  O5: BinaryValue;
  /** analogClockOverlay.showSolidBlack */
  OB: BinaryValue;
  /** countdown.enabled */
  CE: BinaryValue;
  /** countdown.year */
  CY: number;
  /** countdown.month */
  CI: number;
  /** countdown.day */
  CD: number;
  /** countdown.hour */
  CH: number;
  /** countdown.minute */
  CM: number;
  /** countdown.second */
  CS: number;
  /** presets.alexaOn */
  A0: number;
  /** presets.alexaOff */
  A1: number;
  /** presets.countdownEnd */
  MC: number;
  /** presets.timedLightEnd */
  MN: number;
  /** buttonActions.0.short */
  MP0: number;
  /** buttonActions.0.long */
  ML0: number;
  /** buttonActions.0.double */
  MD0: number;
  /** buttonActions.0.short */
  MP1: number;
  /** buttonActions.0.long */
  ML1: number;
  /** buttonActions.0.double */
  MD1: number;
  /** buttonActions.0.short */
  MP2: number;
  /** buttonActions.0.long */
  ML2: number;
  /** buttonActions.0.double */
  MD2: number;
  /** buttonActions.0.short */
  MP3: number;
  /** buttonActions.0.long */
  ML3: number;
  /** buttonActions.0.double */
  MD3: number;
  /** timeControlledPresets.0.hour */
  H0: number;
  /** timeControlledPresets.0.minute */
  N0: number;
  /** timeControlledPresets.0.preset */
  T0: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.0.enabled,
   * timeControlledPresets.0.days[0-6],
   * */
  W0: number;
  /** timeControlledPresets.0.startDate.month */
  M0: number;
  /** timeControlledPresets.0.endDate.month */
  P0: number;
  /** timeControlledPresets.0.startDate.day */
  D0: number;
  /** timeControlledPresets.0.endDate.day */
  E0: number;
  /** timeControlledPresets.1.hour */
  H1: number;
  /** timeControlledPresets.1.minute */
  N1: number;
  /** timeControlledPresets.1.preset */
  T1: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.1.enabled,
   * timeControlledPresets.1.days[0-6],
   * */
  W1: number;
  /** timeControlledPresets.1.startDate.month */
  M1: number;
  /** timeControlledPresets.1.endDate.month */
  P1: number;
  /** timeControlledPresets.1.startDate.day */
  D1: number;
  /** timeControlledPresets.1.endDate.day */
  E1: number;
  /** timeControlledPresets.2.hour */
  H2: number;
  /** timeControlledPresets.2.minute */
  N2: number;
  /** timeControlledPresets.2.preset */
  T2: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.2.enabled,
   * timeControlledPresets.2.days[0-6],
   * */
  W2: number;
  /** timeControlledPresets.2.startDate.month */
  M2: number;
  /** timeControlledPresets.2.endDate.month */
  P2: number;
  /** timeControlledPresets.2.startDate.day */
  D2: number;
  /** timeControlledPresets.2.endDate.day */
  E2: number;
  /** timeControlledPresets.3.hour */
  H3: number;
  /** timeControlledPresets.3.minute */
  N3: number;
  /** timeControlledPresets.3.preset */
  T3: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.3.enabled,
   * timeControlledPresets.3.days[0-6],
   * */
  W3: number;
  /** timeControlledPresets.3.startDate.month */
  M3: number;
  /** timeControlledPresets.3.endDate.month */
  P3: number;
  /** timeControlledPresets.3.startDate.day */
  D3: number;
  /** timeControlledPresets.3.endDate.day */
  E3: number;
  /** timeControlledPresets.4.hour */
  H4: number;
  /** timeControlledPresets.4.minute */
  N4: number;
  /** timeControlledPresets.4.preset */
  T4: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.4.enabled,
   * timeControlledPresets.4.days[0-6],
   * */
  W4: number;
  /** timeControlledPresets.4.startDate.month */
  M4: number;
  /** timeControlledPresets.4.endDate.month */
  P4: number;
  /** timeControlledPresets.4.startDate.day */
  D4: number;
  /** timeControlledPresets.4.endDate.day */
  E4: number;
  /** timeControlledPresets.5.hour */
  H5: number;
  /** timeControlledPresets.5.minute */
  N5: number;
  /** timeControlledPresets.5.preset */
  T5: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.5.enabled,
   * timeControlledPresets.5.days[0-6],
   * */
  W5: number;
  /** timeControlledPresets.5.startDate.month */
  M5: number;
  /** timeControlledPresets.5.endDate.month */
  P5: number;
  /** timeControlledPresets.5.startDate.day */
  D5: number;
  /** timeControlledPresets.5.endDate.day */
  E5: number;
  /** timeControlledPresets.6.hour */
  H6: number;
  /** timeControlledPresets.6.minute */
  N6: number;
  /** timeControlledPresets.6.preset */
  T6: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.6.enabled,
   * timeControlledPresets.6.days[0-6],
   * */
  W6: number;
  /** timeControlledPresets.6.startDate.month */
  M6: number;
  /** timeControlledPresets.6.endDate.month */
  P6: number;
  /** timeControlledPresets.6.startDate.day */
  D6: number;
  /** timeControlledPresets.6.endDate.day */
  E6: number;
  /** timeControlledPresets.7.hour */
  H7: number;
  /** timeControlledPresets.7.minute */
  N7: number;
  /** timeControlledPresets.7.preset */
  T7: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.7.enabled,
   * timeControlledPresets.7.days[0-6],
   * */
  W7: number;
  /** timeControlledPresets.7.startDate.month */
  M7: number;
  /** timeControlledPresets.7.endDate.month */
  P7: number;
  /** timeControlledPresets.7.startDate.day */
  D7: number;
  /** timeControlledPresets.7.endDate.day */
  E7: number;
  /** timeControlledPresets.8.minute */
  N8: number;
  /** timeControlledPresets.8.preset */
  T8: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.8.enabled,
   * timeControlledPresets.8.days[0-6],
   * */
  W8: number;
  /** timeControlledPresets.9.minute */
  N9: number;
  /** timeControlledPresets.9.preset */
  T9: number;
  /**
   * 8 bit int of boolean toggles:
   * timeControlledPresets.9.enabled,
   * timeControlledPresets.9.days[0-6],
   * */
  W9: number;
}

/**
 * Security settings in app format.
 */
export interface SecuritySettings {
  settingsPin: string;
  secureWirelessUpdate: boolean;
  denyWifiSettingsAccessIfLocked: boolean;
  enableArduinoOTA: boolean;
  otaUpdatePassword: string;
  triggerFactoryReset: boolean;
}

/**
 * Security settings in WLED backend format.
 */
export interface WledSecuritySettings {
  /** settingsPin */
  PIN: string;
  /** secureWirelessUpdate */
  NO: BinaryValue;
  /** denyWifiSettingsAccessIfLocked */
  OW: BinaryValue;
  /** enableArduinoOTA */
  AO: BinaryValue;
  /** otaUpdatePassword - NOT INCLUDED in get request */
  OP: string;
  /** triggerFactoryReset - NOT INCLUDED in get request */
  RS: BinaryValue;
}

/**
 * DMX settings in app format.
 */
export interface DMXSettings {
  e131ProxyUniverse: number;
  DMXChannels: number;
  DMXGap: number;
  DMXStart: number;
  DMXStartLED: number;
  channel1: boolean;
  channel2: boolean;
  channel3: boolean;
  channel4: boolean;
  channel5: boolean;
  channel6: boolean;
  channel7: boolean;
  channel8: boolean;
  channel9: boolean;
  channel10: boolean;
  channel11: boolean;
  channel12: boolean;
  channel13: boolean;
  channel14: boolean;
  channel15: boolean;
}

/**
 * DMX settings in WLED format.
 */
export interface WledDMXSettings {
  PU: number;
  CN: number;
  CG: number;
  CS: number;
  SL: number;
  CH1: BinaryValue;
  CH2: BinaryValue;
  CH3: BinaryValue;
  CH4: BinaryValue;
  CH5: BinaryValue;
  CH6: BinaryValue;
  CH7: BinaryValue;
  CH8: BinaryValue;
  CH9: BinaryValue;
  CH10: BinaryValue;
  CH11: BinaryValue;
  CH12: BinaryValue;
  CH13: BinaryValue;
  CH14: BinaryValue;
  CH15: BinaryValue;
}

/**
 * User mod settings in app format.
 */
export interface UserModSettings {
  /** global I2C SDA pin */
  i2c_sda: number;
  /** global I2C SCL pin */
  i2c_scl: number;
  /** global SPI DATA/MOSI pin */
  spi_mosi: number;
  /** global SPI DATA/MISO pin */
  spi_miso: number;
  /** global SPI CLOCK/SCLK pin */
  spi_sclk: number;
}

/**
 * User mod settings in WLED format.
 */
export interface WledUserModSettings {
  /** i2c_sda */
  SDA: number;
  /** i2c_scl */
  SCL: number;
  /** spi_mosi */
  MOSI: number;
  /** spi_miso */
  MISO: number;
  /** spi_sclk */
  SCLK: number;
}

/**
 * Update settings in app format.
 */
export interface UpdateSettings {
}

/**
 * Update settings in WLED format.
 */
export interface WledUpdateSettings {
}

/**
 * 2D settings in app format.
 */
export type _2DSettings = {
  /** number used as a boolean */
  isMatrix: number;
  maxPanels: number;
  firstPanelWidth: number;
  firstPanelHeight: number;
  panelCount: number;
}
& { [key in `panel${_2DSettings_PanelId}BottomStart`]?: number; }
& { [key in `panel${_2DSettings_PanelId}RightStart`]?: number; }
& { [key in `panel${_2DSettings_PanelId}Vertical`]?: number; }
& { [key in `panel${_2DSettings_PanelId}Serpentine`]?: number; }
& { [key in `panel${_2DSettings_PanelId}XOffset`]?: number; }
& { [key in `panel${_2DSettings_PanelId}YOffset`]?: number; }
& { [key in `panel${_2DSettings_PanelId}Width`]?: number; }
& { [key in `panel${_2DSettings_PanelId}Height`]?: number; };

/**
 * 2D settings in WLED format.
 */
export type Wled2DSettings = {
  SOMP: number;
  maxPanels: number;
  PW: number;
  PH: number;
  MPC: number;
}
& { [key in `P${_2DSettings_PanelId}B`]?: number; }
& { [key in `P${_2DSettings_PanelId}R`]?: number; }
& { [key in `P${_2DSettings_PanelId}V`]?: number; }
& { [key in `P${_2DSettings_PanelId}S`]?: number; }
& { [key in `P${_2DSettings_PanelId}X`]?: number; }
& { [key in `P${_2DSettings_PanelId}Y`]?: number; }
& { [key in `P${_2DSettings_PanelId}W`]?: number; }
& { [key in `P${_2DSettings_PanelId}H`]?: number; };

type _2DSettings_PanelId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63;
