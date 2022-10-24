import { AppStateProps, WledIpAddress } from '../app-types';
import { environment } from 'src/environments/environment';

export const NO_DEVICE_IP_SELECTED: WledIpAddress = {
  name: 'None',
  ipv4Address: '',
};

const getMockWledIpAddresses = (options: {
  testMaxHeight: boolean,
  testMaxWidth: boolean,
}) => {
  const wledIpAddresses: WledIpAddress[] = [
    {
      name: 'Living Room',
      ipv4Address: '192.168.100.171',
    },
    {
      name: 'Bedroom',
      ipv4Address: '192.168.100.21',
    },
    {
      name: 'Office',
      ipv4Address: '192.168.100.5',
    },
  ];
  if (options.testMaxHeight) {
    for (let i = 0; i < 10; i++) {
      wledIpAddresses.push({
        name: `SAMPLE DEVICE ${i + 1}`,
        ipv4Address: `192.168.${i + 1}.${i * 2 + 1}`,
      });
    }
  }
  if (options.testMaxWidth) {
    wledIpAddresses.push({
      name: 'really really really really really really really long name for testing',
      ipv4Address: '192.168.420.69',
    });
  }
  return wledIpAddresses;
}
const DEFAULT_WLED_IP_ADDRESSES: WledIpAddress[] = getMockWledIpAddresses({
  testMaxHeight: true,
  testMaxWidth: false,
});

const DEFAULT_SELECTED_WLED_IP_ADDRESS = NO_DEVICE_IP_SELECTED;

// TODO uncomment once device switching is fully implemented & working
// const DEFAULT_SELECTED_WLED_IP_ADDRESS: WledIpAddress = environment.production
// ? NO_DEVICE_IP_SELECTED
// : DEFAULT_WLED_IP_ADDRESSES[0];

/** State of the app before hydration. Everything is turned off. */
export const DEFAULT_APP_STATE: AppStateProps = {
  state: {
    on: false,
    brightness: 0,
    transition: 0,
    currentPresetId: 0,
    currentPlaylistId: 0,
    nightLight: {
      on: false,
      durationMinutes: 0,
      mode: 0,
      targetBrightness: 0,
      remainingSeconds: 0,
    },
    udp: {
      shouldSend: false,
      shouldReceive: false,
    },
    liveViewOverride: 0,
    mainSegmentId: 0,
  },
  info: {
    versionName: '',
    versionId: 0,
    ledInfo: {
      totalLeds: 0,
      fps: 0,
      hasWhiteChannel: false,
      showWhiteChannelSlider: false,
      amps: 0,
      maxAmps: 0,
      maxSegments: 0,
    },
    shouldToggleReceiveWithSend: false,
    name: '',
    udpPort: 0,
    isLive: false,
    lm: '',
    sourceIpAddress: '',
    webSocketCount: 0,
    effectCount: 0,
    paletteCount: 0,
    wifi: {
      bssid: '',
      rssi: 0,
      signalStrength: 0,
      channel: 0,
    },
    fileSystem: {
      usedSpaceKb: 0,
      totalSpaceKb: 0,
      lastPresetsJsonEditTimestamp: 0,
    },
    wledDevicesOnNetwork: 0,
    platform: '',
    arduinoVersion: '',
    freeHeapBytes: 0,
    uptimeSeconds: 0,
    opt: 0,
    brand: '',
    productName: '',
    macAddress: '',
    ipAddress: '',
  },
  palettes: [],
  effects: [],
  localSettings: {
    isLiveViewActive: false,
    selectedWledIpAddress: DEFAULT_SELECTED_WLED_IP_ADDRESS,
    wledIpAddresses: DEFAULT_WLED_IP_ADDRESSES,
  },
  nodes: [],
};
