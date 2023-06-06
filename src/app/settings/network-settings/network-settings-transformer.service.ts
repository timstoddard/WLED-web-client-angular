import { Injectable } from '@angular/core';
import { NetworkSettings, PickBooleans, PickNonBooleans, WledNetworkSettings, convertToBoolean, convertToString, convertToWledRequestFormat } from '../shared/settings-types';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class NetworkSettingsTransformerService {
  /**
   * Converts from API response format.
   */
  transformWledNetworkSettingsToNetworkSettings = (settings: WledNetworkSettings): Partial<NetworkSettings> => ({
    localNetwork: {
      ssid: convertToString(settings.CS),
      password: convertToString(settings.CP),
      staticIp: this.generateIPAddress(
        settings.I0,
        settings.I1,
        settings.I2,
        settings.I3,
      ),
      staticGateway: this.generateIPAddress(
        settings.G0,
        settings.G1,
        settings.G2,
        settings.G3,
      ),
      staticSubnetMask: this.generateIPAddress(
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
    disableWifiSleep: convertToBoolean(settings.WS),
    ethernetType: settings.ETH,
  })

  /**
   * Converts into API response format.
   */
  transformNetworkSettingsToWledNetworkSettings = (settings: NetworkSettings) => {
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
    } = localNetwork;
    
    const ipAddressRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const staticIpParts = staticIp.match(ipAddressRegex);
    const staticGatewayParts = staticGateway.match(ipAddressRegex);
    const staticSubnetMaskParts = staticSubnetMask.match(ipAddressRegex);
    
    const baseOptions: PickNonBooleans<WledNetworkSettings> = {
      CS: localNetwork.ssid,
      CP: localNetwork.password,
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
      AC: wledAccessPoint.wifiChannel,
      AB: wledAccessPoint.openAP,
      ETH: ethernetType,
    };
    const booleanOptions: PickBooleans<WledNetworkSettings> = {
      AH: wledAccessPoint.hideAPName,
      WS: disableWifiSleep,
    };
    return convertToWledRequestFormat<WledNetworkSettings>(baseOptions, booleanOptions);
  }

  /**
   * Generate IP address from the 4 number blocks.
   * @param block1 
   * @param block2 
   * @param block3 
   * @param block4 
   * @returns 
   */
  private generateIPAddress = (
    block1: number,
    block2: number,
    block3: number,
    block4: number,
  ) => {
    const formattedIp = [block1, block2, block3, block4]
      .map(n => convertToString(n))
      .join('.');
    return formattedIp;
  }
}
