export interface WLEDInfo {
  /** Version name. */
  readonly ver: string;
  /** Build ID (YYMMDDB, B = daily build index). */
  readonly vid: number;
  /** Info about the LED setup. */
  readonly leds: WLEDLedInfo;
  /** If `true`, a UI with only a single button for toggling sync should toggle receive & send, otherwise send only. */
  readonly str: boolean;
  /** Friendly name of the light. Intended for display in lists and titles. */
  readonly name: string;
  /** The UDP port for realtime packets and WLED broadcast. */
  readonly udpport: number;
  /** If `true`, the software is currently receiving realtime data via UDP or E1.31. */
  readonly live: boolean;
  /** Info about the realtime data source. */
  readonly lm: string;
  /** Realtime data source IP address. */
  readonly lip: string;
  /** [-1 - 8] Number of currently connected WebSockets clients. -1 indicates that WS is unsupported in this build. */
  readonly ws: number;
  /** Number of effects included. */
  readonly fxcount: number;
  /** Number of palettes configured. */
  readonly palcount: number;
  /** Info about the wifi signal strength. */
  readonly wifi: WLEDWifiInfo;
  /** Info about the embedded LittleFS filesystem. */
  readonly fs: WLEDFileSystemInfo;
  /** [-1 - 255] Number of other WLED devices discovered on the network. -1 if Node discovery disabled. */
  readonly ndc: number;
  /** Name of the platform. */
  readonly arch: string;
  /** Version of the underlying (Arduino core) SDK. */
  readonly core: string;
  /** Bytes of available heap memory (RAM). Problematic if < `10k`. */
  readonly freeheap: number;
  /** Time since the last boot/reset in seconds. */
  readonly uptime: number;
  /** Used for debugging purposes only. */
  readonly opt: number;
  /** The producer/vendor of the light. Always `'WLED'` for standard installations. */
  readonly brand: string;
  /** The product name. Always `'FOSS'` for standard installations. */
  readonly product: string;
  /** The hexadecimal hardware MAC address of the light, lowercase and without colons. */
  readonly mac: string;
  /** The IP address of this device. Empty string if not connected. */
  readonly ip: string;
}

export interface WLEDLedInfo {
  /** [1-1200] Total LED count. */
  readonly count: number;
  /** [0-255] Current frames per second. */
  readonly fps: number;
  /** [0-65000] Current LED power usage in milliamps as determined by the ABL. `0` if ABL is disabled. */
  readonly pwr: number;
  /** [0-65000] Maximum power budget in milliamps for the ABL. `0` if ABL is disabled. */
  readonly maxpwr: number;
  /** Maximum number of segments supported by this version. */
  readonly maxseg: number;
  /** Logical AND of all active segment's virtual light capabilities. Bitwise AND of the per-segment light capability values. */
  readonly lc: number;
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
  readonly seglc: number[];
}

export interface WLEDWifiInfo {
  /** The BSSID (hardware address) of the currently connected network. */
  readonly bssid: string;
  /** Measurement of how well your device can hear a signal from an access point or router (useful for determining if you have enough signal to get a good wireless connection). */
  readonly rssi: number;
  /** [0 - 100] Relative signal quality of the current connection. */
  readonly signal: number;
  /** [1 - 14] The current WiFi channel. */
  readonly channel: number;
}

export interface WLEDFileSystemInfo {
  /** Estimate of used filesystem space in kilobytes. */
  readonly u: number;
  /** Total filesystem size in kilobytes. */
  readonly t: number;
  /** Unix timestamp for the last modification to the `presets.json` file. Not accurate after boot or after using `/edit`. */
  readonly pmt: number;
}
