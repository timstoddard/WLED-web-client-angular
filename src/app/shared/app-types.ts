// TODO add comments to properties (can mostly copy from api types)

export interface AppState {
  state: AppWledState;
  info: AppInfo;
  palettes: string[];
  effects: string[];
  localSettings: AppLocalSettings;
  nodes: AppNode[];
}

export interface AppWledState {
  on: boolean;
  brightness: number;
  transition: number;
  currentPresetId: number;
  currentPlaylistId: number;
  nightLight: AppNightLightState;
  udp: AppUdpState;
  liveViewOverride: number;
  mainSegmentId: number;
  segments: AppSegment[];
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
  readonly freeHeapBytes: number;
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

export interface AppSegment {
  /** Segment ID. */
  id: number;
  /** Whether or not the segment is expanded. (client-only property) */
  isExpanded: boolean;
  /** LED the segment starts at. */
  start: number;
  /** LED the segment stops at (excluded by range). If `stop` is set to a lower or equal value than `start` (setting to `0` is recommended), the segment is invalidated and deleted. */
  stop: number;
  /** Length of the segment (`stop` - `start`). `stop` has precedence, so if it is included, `len` is ignored. */
  length: number;
  /** Grouping (how many consecutive LEDs of the same segment will be grouped to the same color) [0-255]. */
  group: number;
  /** Spacing (how many LEDs are turned off and skipped between each group) [0-255]. */
  space: number;
  /** Offset (how many LEDs to shift the virtual start of the segments). */
  startOffset: number;
  /** Array that has up to 3 color arrays as elements, the primary, secondary (background) and tertiary colors of the segment. Each color is an array of 3 or 4 bytes, which represent an RGB(W) color. */
  colors: number[][];
  /** ID of the effect. */
  effectId: number;
  /** Effect speed [0-255]. */
  effectSpeed: number;
  /** Effect intensity [0-255]. */
  effectIntensity: number;
  /** ID of the color palette. */
  paletteId: number;
  /** `true` if the segment is selected. Selected segments will have their state (color/FX) updated by APIs that don't support segments (currently any API except the JSON API). If no segment is selected, the first segment (id=0) will behave as if selected. If multiple segments are selected, WLED will report the state of the numerically first (lowest id) segment that is selected to APIs (UDP sync, HTTP, MQTT, Blynk...). */
  isSelected: boolean;
  /** Reverses direction of the segment. Makes animations to go in the opposite direction. */
  isReversed: boolean;
  /** Turns on and off the individual segment. */
  isOn: boolean;
  /** Sets the individual segment brightness [0-255]. */
  brightness: number;
  /** Segment name. */
  name: string;
  /** Color temperature. */
  colorTemp: number;
  /** Mirrors the segment. */
  isMirrored: boolean;
  /** Loxone RGB value for primary color. Each color (RRR,GGG,BBB) is specified in the range from 0 to 100% [0-100100100]. */
  loxonePrimaryRgb?: number;
  /** Loxone RGB value for secondary color. Each color (RRR,GGG,BBB) is specified in the range from 0 to 100% [0-100100100]. */
  loxoneSecondaryRgb?: number;
}

/** Corresponds to `WledNode` type. */
export interface AppNode {
  name: string;
  ipAddress: string;
  type: number;
  versionId: string;
}
