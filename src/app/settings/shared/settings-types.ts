import { BehaviorSubject } from "rxjs";
import { SettingsParsedValues } from "./api-response-parser.service";

// https://stackoverflow.com/questions/70344859/how-to-filter-an-interface-using-conditional-types-in-typescript
type PickKeysByValueType<T, TYPE> = {
  [K in keyof T]: T[K] extends TYPE ? K : never
}[keyof T];

type PickKeysByNotValueType<T, TYPE> = {
  [K in keyof T]: T[K] extends TYPE ? never : K
}[keyof T];

export type PickBooleans<T> = Pick<T, PickKeysByValueType<T, boolean>>;
export type PickNonBooleans<T> = Pick<T, PickKeysByNotValueType<T, boolean>>;

export type BinaryValue = 0 | 1;

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
 * The backend logic uses "has arg" instead of "arg value" for boolean (checkbox) form controls. So, any booleans with value false are simply removed.
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


/**
 * Security settigns in app format.
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
  NO?: BinaryValue;
  /** otaUpdatePassword */
  OP: string;
  /** denyWifiSettingsAccessIfLocked */
  OW?: BinaryValue;
  /** triggerFactoryReset */
  RS?: BinaryValue;
  /** enableArduinoOTA */
  AO?: BinaryValue;
}

/**
 * Network settigns in app format.
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
  /** localNetworkSSID */
  CS: string;
  /** localNetworkPassword */
  CP: string;
  /** localNetworkStaticIp (block 1/4) */
  I0: number;
  /** localNetworkStaticIp (block 2/4) */
  I1: number;
  /** localNetworkStaticIp (block 3/4) */
  I2: number;
  /** localNetworkStaticIp (block 4/4) */
  I3: number;
  /** localNetworkStaticGateway (block 1/4) */
  G0: number;
  /** localNetworkStaticGateway (block 2/4) */
  G1: number;
  /** localNetworkStaticGateway (block 3/4) */
  G2: number;
  /** localNetworkStaticGateway (block 4/4) */
  G3: number;
  /** localNetworkStaticSubnetMask (block 1/4) */
  S0: number;
  /** localNetworkStaticSubnetMask (block 2/4) */
  S1: number;
  /** localNetworkStaticSubnetMask (block 3/4) */
  S2: number;
  /** localNetworkStaticSubnetMask (block 4/4) */
  S3: number;
  /** localNetworkMDNS */
  CM: string;
  /** wledAccessPointSSID */
  AS: string;
  /** wledAccessPointPassword */
  AP: string;
  /** wledAccessPointHideAPName */
  AH?: BinaryValue;
  /** wledAccessPointWifiChannel */
  AC: number;
  /** wledAccessPointOpenAP */
  AB: number;
  /** disableWifiSleep */
  WS?: BinaryValue;
  /** ethernetType. Not included in response for WIFI controllers. */
  ETH?: number;
}
