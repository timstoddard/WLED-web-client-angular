import { WledSegment } from './api-types';

// TODO add comments to properties (can mostly copy from api types)

export interface AppStateProps { // TODO better interface name
  state: AppState;
  info: AppInfo;
  palettes: string[];
  effects: string[];
  localSettings: AppLocalSettings;
}

export interface AppState {
  on: boolean;
  brightness: number;
  transition: number;
  currentPresetId: number;
  currentPlaylistId: number;
  nightLight: AppNightLightState;
  udp: AppUdpState;
  liveViewOverride: number;
  mainSegmentId: number;
}

export interface AppNightLightState {
  on: boolean;
  durationMinutes: number;
  mode: 0 | 1 | 2 | 3;
  targetBrightness: number;
  remainingSeconds: number;
}

export interface AppUdpState {
  shouldSend: boolean;
  shouldReceive: boolean;
}

export interface AppInfo {
  readonly versionName: string;
  readonly versionId: number;
  readonly ledInfo: AppLedInfo;
  readonly shouldToggleReceiveWithSend: boolean;
  readonly name: string;
  readonly udpPort: number;
  readonly isLive: boolean; // TODO rename, only for UDP
  readonly lm: string; // TODO is this needed?
  readonly sourceIpAddress: string;
  readonly webSocketCount: number;
  readonly effectCount: number;
  readonly paletteCount: number;
  readonly wifi: AppWifiInfo;
  readonly fileSystem: AppFileSystemInfo;
  readonly wledDevicesOnNetwork: number;
  readonly platform: string;
  readonly arduinoVersion: string;
  readonly freeHeapBytes: number; // TODO is this bytes or other unit?
  readonly uptimeSeconds: number;
  readonly opt: number; // TODO is this needed?
  readonly brand: string;
  readonly productName: string;
  readonly macAddress: string;
  readonly ipAddress: string;
}

export interface AppLedInfo {
  readonly totalLeds: number;
  readonly fps: number;
  readonly hasWhiteChannel: boolean;
  readonly showWhiteChannelSlider: boolean;
  readonly amps: number;
  readonly maxAmps: number;
  readonly maxSegments: number;
}

export interface AppWifiInfo {
  readonly bssid: string;
  readonly rssi: number;
  readonly signalStrength: number;
  readonly channel: number;
}

export interface AppFileSystemInfo {
  readonly usedSpaceKb: number;
  readonly totalSpaceKb: number;
  readonly lastPresetsJsonEditTimestamp: number;
}

export interface AppLocalSettings {
  isLiveViewActive: boolean;
  // TODO can this be a string? (pros/cons)
  selectedWledIpAddress: WledIpAddress;
  wledIpAddresses: WledIpAddress[];
}

export interface WledIpAddress {
  name: string,
  ipv4Address: string,
}

export interface Segment extends WledSegment {
  /** Segment ID. */
  id: number;
  /** Segment name. */
  name: string;
  /** Whether or not the segment is expanded. */
  isExpanded: boolean;
}
