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
  });
}

const LOAD_API_URL_DELAY_MS = 2000;
/**
 * Returns a timer to delay before loading settings form values.
 */
export const getLoadSettingsDelayTimer = () => timer(LOAD_API_URL_DELAY_MS);

/**
 * Security settings in app format.
 */
export interface SecuritySettings {
  settingsPin: string;
  secureWirelessUpdate: boolean;
  otaUpdatePassword: string;
  denyWifiSettingsAccessIfLocked: boolean;
  triggerFactoryReset: boolean;
  enableArduinoOTA: boolean;
}

/**
 * Security settings in WLED backend format.
 */
export interface WledSecuritySettings {
  /** settingsPin */
  PIN: string;
  /** secureWirelessUpdate */
  NO: BinaryValue;
  /** otaUpdatePassword */
  OP: string;
  /** denyWifiSettingsAccessIfLocked */
  OW: BinaryValue;
  /** triggerFactoryReset */
  RS: BinaryValue;
  /** enableArduinoOTA */
  AO: BinaryValue;
}

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
  buttonActions: {
    /** TODO add button actions */
  };
  scheduledPresets: ScheduledPreset[];
}

interface ScheduledPresetBase {
  enabled: boolean;
  presetId: number;
  minute: number;
  days: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
}

/**
 * Preset that is turned on at specific dates and times.
 */
export interface DateTimeScheduledPreset extends ScheduledPresetBase {
  hour: number;
  startDate: {
    month: number;
    day: number;
  };
  endDate: {
    month: number;
    day: number;
  };
}

/**
 * Preset that is turned on at sunrise or sunset.
 */
export interface SunriseSunsetScheduledPreset extends ScheduledPresetBase {
  type: 'sunset' | 'sunrise';
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
  LN: string;
  /** latitude */
  LT: string;
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
  /** timeControlledPresets.0.hour */
  H0: number;
  /** timeControlledPresets.0.minute */
  N0: number;
  /** timeControlledPresets.0.preset */
  T0: number;
  /** timeControlledPresets.0.enabled */
  W0: BinaryValue;
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
  /** timeControlledPresets.1.enabled */
  W1: BinaryValue;
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
  /** timeControlledPresets.2.enabled */
  W2: BinaryValue;
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
  /** timeControlledPresets.3.enabled */
  W3: BinaryValue;
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
  /** timeControlledPresets.4.enabled */
  W4: BinaryValue;
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
  /** timeControlledPresets.5.enabled */
  W5: BinaryValue;
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
  /** timeControlledPresets.6.enabled */
  W6: BinaryValue;
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
  /** timeControlledPresets.7.enabled */
  W7: BinaryValue;
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
  /** timeControlledPresets.8.enabled */
  W8: BinaryValue;
  /** timeControlledPresets.9.minute */
  N9: number;
  /** timeControlledPresets.9.preset */
  T9: number;
  /** timeControlledPresets.9.enabled */
  W9: BinaryValue;
}
