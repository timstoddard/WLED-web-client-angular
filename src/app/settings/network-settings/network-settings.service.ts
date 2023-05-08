import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api-service/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { WLEDIpAddress } from '../../shared/app-types/app-types';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { BehaviorSubject, timer } from 'rxjs';
import { ApiResponseParserService, SettingsParsedValues } from '../shared/api-response-parser.service';
import { WIFI_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';

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
  AH: BinaryValue;
  /** wledAccessPointWifiChannel */
  AC: number;
  /** wledAccessPointOpenAP */
  AB: number;
  /** disableWifiSleep */
  WS: BinaryValue;
  /** ethernetType. Not included in response for WIFI controllers. */
  ETH?: number;
}

// TODO duplicated from security settings service
type BinaryValue = 0 | 1;
const convertToBoolean = (n?: BinaryValue) => !!n;
const convertToString = (n: unknown) => n ? n.toString() : '';

const transformNetworkSettingsToWledNetworkSettings = (settings: NetworkSettings) => {
  const {
    localNetwork,
    wledAccessPoint,
    disableWifiSleep,
    ethernetType,
  } = settings;
  const {
    staticIp,
    staticGateway,
    staticSubnetMask,
    mDNS
  } = localNetwork;

  const ipAddressRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const staticIpParts = staticIp.match(ipAddressRegex);
  const staticGatewayParts = staticGateway.match(ipAddressRegex);
  const staticSubnetMaskParts = staticSubnetMask.match(ipAddressRegex);

  // TODO is local network ssid/password not included?
  const formValues = {
    I0: parseInt(staticIpParts![1], 10),
    I1: parseInt(staticIpParts![2], 10),
    I2: parseInt(staticIpParts![3], 10),
    I3: parseInt(staticIpParts![4], 10),
    G0: parseInt(staticGatewayParts![1], 10),
    G1: parseInt(staticGatewayParts![2], 10),
    G2: parseInt(staticGatewayParts![3], 10),
    G3: parseInt(staticGatewayParts![4], 10),
    S0: parseInt(staticSubnetMaskParts![1], 10),
    S1: parseInt(staticSubnetMaskParts![2], 10),
    S2: parseInt(staticSubnetMaskParts![3], 10),
    S3: parseInt(staticSubnetMaskParts![4], 10),
    CM: localNetwork.mDNS,
    AS: wledAccessPoint.ssid,
    AP: wledAccessPoint.password,
    // TODO server checks for existence not truthiness
    AH: wledAccessPoint.hideAPName ? true : undefined,
    AC: wledAccessPoint.wifiChannel,
    AB: wledAccessPoint.openAP,
    // TODO server checks for existence not truthiness 
    WS: disableWifiSleep ? true : undefined,
    ETH: ethernetType,
  };

  // TODO finish this
}

const generateIPAddress = (
  _1?: number,
  _2?: number,
  _3?: number,
  _4?: number,
) => {
  const formattedIp = [_1, _2, _3, _4]
    .map(n => convertToString(n))
    .join('.');
  return formattedIp;
}

/**
 * Converts from API response format.
 */
const transformWledNetworkSettingsToNetworkSettings = (settings: Partial<WledNetworkSettings>): Partial<NetworkSettings> => ({
  localNetwork: {
    ssid: convertToString(settings.CS),
    password: convertToString(settings.CP),
    staticIp: generateIPAddress(
      settings.I0,
      settings.I1,
      settings.I2,
      settings.I3,
    ),
    staticGateway: generateIPAddress(
      settings.G0,
      settings.G1,
      settings.G2,
      settings.G3,
    ),
    staticSubnetMask: generateIPAddress(
      settings.S0,
      settings.S1,
      settings.S2,
      settings.S3,
    ),
    mDNS: convertToString(settings.CM),
  },
  wledAccessPoint: {
    ssid: convertToString(settings.AS),
    password: convertToString(settings.AP),
    hideAPName: convertToBoolean(settings.AH),
    wifiChannel: settings.AC!,
    openAP: settings.AB!,
  },
  disableWifiSleep: convertToBoolean(settings.AH),
  ethernetType: settings.ETH,
});


// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class NetworkSettingsService extends UnsubscriberService {
  /** Store the values from the parsed js file for the initial form values and view rendering. */
  private parsedValues = new BehaviorSubject<SettingsParsedValues>({
    formValues: {},
    metadata: {},
  });

  constructor(
    private apiService: ApiService,
    private apiResponseParserService: ApiResponseParserService,
    private appStateService: AppStateService,
  ) {
    super();

    const LOAD_API_URL_DELAY_MS = 2000;
    timer(LOAD_API_URL_DELAY_MS)
      .subscribe(() => {
        this.handleUnsubscribe(this.apiService.settings.wifi.get())
          .subscribe((responseJs) => {
            const {
              formValues,
              metadata,
            } = this.apiResponseParserService.parseJsFile(responseJs, WIFI_PARSE_CONFIGURATIONS);
            console.log('before transform', formValues)
            console.log('before transform', metadata)
            this.parsedValues.next({
              formValues: transformWledNetworkSettingsToNetworkSettings(formValues),
              metadata,
            });
          });
      });
  }

  getParsedValues() {
    return this.parsedValues;
  }

  setWifiSettings(wifiSettings: any /* TODO type */) {
    return this.apiService.settings.wifi.set(wifiSettings);
  }

  /**
   * Sets the client setting of WLED IP addresses on the same network. No backend call is made for this.
   * @param wledIpAddresses ip addresses of WLED devices on the local network, format '123.456.789.123'
   */
  setWLEDIpAddresses(wledIpAddresses: WLEDIpAddress[]) {
    this.appStateService.setLocalSettings({ wledIpAddresses });
  }
}
