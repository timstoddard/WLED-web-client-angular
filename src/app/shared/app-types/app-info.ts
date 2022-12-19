export interface AppInfo {
  /** Version name. */
  readonly versionName: string;
  /** Build ID (YYMMDDB, B = daily build index). */
  readonly versionId: number;
  /** Info about the LED setup. */
  readonly ledInfo: AppLedInfo;
  /** If `true`, a UI with only a single button for toggling sync should toggle receive & send, otherwise send only. */
  readonly shouldToggleReceiveWithSend: boolean;
  /** Friendly name of the light. Intended for display in lists and titles. */
  readonly name: string;
  /** The UDP port for realtime packets and WLED broadcast. */
  readonly udpPort: number;
  /** If `true`, the software is currently receiving realtime data via UDP or E1.31. */
  readonly isLive: boolean;
  /** Info about the realtime data source. */
  readonly lm: string; // TODO how to use this?
  /** Realtime data source IP address. */
  readonly sourceIpAddress: string;
  /** [-1 - 8] Number of currently connected WebSockets clients. -1 indicates that WS is unsupported in this build. */
  readonly webSocketCount: number;
  /** Number of effects included. */
  readonly effectCount: number;
  /** Number of palettes configured. */
  readonly paletteCount: number;
  /** Info about the wifi signal strength. */
  readonly wifi: AppWifiInfo;
  /** Info about the embedded LittleFS filesystem. */
  readonly fileSystem: AppFileSystemInfo;
  /** [-1 - 255] Number of other WLED devices discovered on the network. -1 if Node discovery disabled. */
  readonly wledDevicesOnNetwork: number;
  /** Name of the platform. */
  readonly platform: string;
  /** Version of the underlying (Arduino core) SDK. */
  readonly arduinoVersion: string;
  /** Bytes of available heap memory (RAM). Problematic if < `10k`. */
  readonly freeHeapBytes: number;
  /** Time since the last boot/reset in seconds. */
  readonly uptimeSeconds: number;
  /** Used for debugging purposes only. */
  readonly opt: number; // TODO how to use this?
  /** The producer/vendor of the light. Always `'WLED'` for standard installations. */
  readonly brand: string;
  /** The product name. Always `'FOSS'` for standard installations. */
  readonly productName: string;
  /** The hexadecimal hardware MAC address of the light, lowercase and without colons. */
  readonly macAddress: string;
  /** The IP address of this device. Empty string if not connected. */
  readonly ipAddress: string;
}

export interface AppLedInfo {
  /** [1-1200] Total LED count. */
  readonly totalLeds: number;
  /** [0-255] Current frames per second. */
  readonly fps: number;
  /** [0-65000] Current LED power usage in milliamps as determined by the ABL. `0` if ABL is disabled. */
  readonly amps: number;
  /** [0-65000] Maximum power budget in milliamps for the ABL. `0` if ABL is disabled. */
  readonly maxAmps: number;
  /** Maximum number of segments supported by this version. */
  readonly maxSegments: number;
  /** Logical AND of all active segment's virtual light capabilities. Bitwise AND of the per-segment light capability values. */
  readonly lightCapabilities: number;
  /** Per-segment virtual light capabilities.
   * 
   * Contains the per-segment color capabilities of the strips. It contains `n+1` 8-bit integers, where `n` is the ID of the last active segment; each index corresponds to the segment with that ID. This integer value indicates whether a given segment supports (24-bit) RGB colors, an extra (8-bit) white channel and/or adjustable color temperature (CCT).
   * 
   * **Bit : Capability**
   * - 0: Segment supports RGB color
   * - 1: Segment supports white channel
   * - 2: Segment supports color temperature
   * - 3-7: Reserved (expect any value) 
   * 
   * **`lc` value : Capabilities**
   * - 0: None. Indicates a segment that does not have a bus within its range, e.g. because it is not active.
   * - 1: Supports RGB
   * - 2: Supports white channel only
   * - 3: Supports RGBW
   * - 4: Supports CCT only, no white channel (unused)
   * - 5: Supports CCT + RGB, no white channel (unused)
   * - 6: Supports CCT (including white channel)
   * - 7: Supports CCT (including white channel) + RGB
   * 
   * Note that CCT is controllable per-segment, while RGB color and white channel have 3 color slots each per segment.
   */
  readonly segmentLightCapabilities: number[];
}

export interface AppWifiInfo {
  /** The BSSID (hardware address) of the currently connected network. */
  readonly bssid: string;
  /** Measurement of how well your device can hear a signal from an access point or router (useful for determining if you have enough signal to get a good wireless connection). */
  readonly rssi: number;
  /** [0 - 100] Relative signal quality of the current connection. */
  readonly signalStrength: number;
  /** [1 - 14] The current WiFi channel. */
  readonly channel: number;
}

export interface AppFileSystemInfo {
  /** Estimate of used filesystem space in kilobytes. */
  readonly usedSpaceKb: number;
  /** Total filesystem size in kilobytes. */
  readonly totalSpaceKb: number;
  /** Unix timestamp for the last modification to the `presets.json` file. Not accurate after boot or after using `/edit`. */
  readonly presetsJsonLastEditTimestamp: number;
}
