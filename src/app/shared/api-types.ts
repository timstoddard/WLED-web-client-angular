// Types based the WLED JSON API info page: https://kno.wled.ge/interfaces/json-api

export interface WledApiResponse {
  /** WLED app state, all fields are settable. */
  state: WledState;
  /** Read-only info about WLED and its configuration. */
  readonly info: WledInfo;
  /** List of effect names. */
  effects: string[];
  /** List of palette names. */
  palettes: string[];
}

export interface WledState {
  /** On/Off state of the light. */
  on: boolean;
  /** Brightness of the light [0-255]. If `on` is `false`, contains last brightness when light was on. Setting `bri` to `0` is supported but it is recommended to use the range `1-255` and use `on: false` to turn off. The state response will never have the value `0` for `bri`. */
  bri: number;
  /** Duration of the crossfade between different colors/brightness levels [0-255]. One unit is 100ms, so a value of 4 results in a transition of 400ms. */
  transition: number;
  /** ID of currently set preset [-1 to 65535]. */
  ps: number;
  /** ID of currently set playlist. For now, this sets the preset cycle feature, `-1` is off and `0` is on. */
  pl: number;
  /** Nightlight settings. */
  nl: WledNightLightSettings;
  /** UDP settings. */
  udpn: WledUdpSettings;
  /** Live data override. 0 is off, 1 is override until live data ends, 2 is override until ESP reboot. */
  lor: number;
  /** ID of main segment. */
  mainseg: number;
  /** List of configured segments. */
  seg: WledSegment[];

  // Below are fields that can only be set, they are never included in an API response.

  /** Similar to transition, but applies to just the current API call [0-255]. */
  tt?: number;
  /** Save current light config to specified preset slot [1-250]. */
  psave?: number;
  /** If `true`, the API response will contain the full JSON state object. */
  v?: boolean;
  /** If `true`, device will reboot immediately. */
  rb?: boolean;
  /** Set module time to the specified unix timestamp. */
  time?: number;
  /** Custom preset playlists. */
  playlist?: WledPlaylistSettings;
}

export interface WledNightLightSettings {
  /** `true` if nightlight currently active. */
  on: boolean;
  /** Duration of nightlight in minutes [1-255]. */
  dur: number;
  /** Nightlight mode (0: instant, 1: fade, 2: color fade, 3: sunrise). */
  mode: 0 | 1 | 2 | 3;
  /** Target brightness of nightlight feature [0-255]. */
  tbri: number;
  /** Remaining nightlight duration in seconds, `-1` if not active. Only in state response, cannot be set. */
  readonly rem: number;
}

export interface WledUdpSettings {
  /** Send WLED broadcast (UDP sync) packet on state change. */
  send: boolean;
  /** Receive broadcast packets. */
  recv: boolean;

  // Below are fields that can only be set for a POST request, they are never included in an API response.

  /** Don't send a broadcast packet (applies to just the current API call). */
  nn?: boolean;
}

export interface WledSegment {
  /** LED the segment starts at. */
  start: number;
  /** LED the segment stops at (excluded by range). If `stop` is set to a lower or equal value than `start` (setting to `0` is recommended), the segment is invalidated and deleted. */
  stop: number;
  /** Length of the segment (`stop` - `start`). `stop` has preference, so if it is included, `len` is ignored. */
  len: number;
  /** Grouping (how many consecutive LEDs of the same segment will be grouped to the same color) [0-255]. */
  grp: number;
  /** Spacing (how many LEDs are turned off and skipped between each group) [0-255]. */
  spc: number;
  /** Offset (how many LEDs to rotate the virtual start of the segments). */
  of: number;
  /** Array that has up to 3 color arrays as elements, the primary, secondary (background) and tertiary colors of the segment. Each color is an array of 3 or 4 bytes, which represent an RGB(W) color. */
  col: number[][];
  /** ID of the effect or `'~'` to increment, `'~-'` to decrement, or `'r'` for random. */
  fx: number | '~' | '~-' | 'r';
  /** Relative effect speed [0-255]. */
  sx: number;
  /** Effect intensity [0-255]. */
  ix: number;
  /** ID of the color palette or `'~'` to increment, `'~-'` to decrement, or `'r'` for random. */
  pal: number | '~' | '~-' | 'r';
  /** `true` if the segment is selected. Selected segments will have their state (color/FX) updated by APIs that don't support segments (currently any API except the JSON API). If no segment is selected, the first segment (id=0) will behave as if selected. If multiple segments are selected, WLED will report the state of the numerically first (lowest id) segment that is selected to APIs (UDP sync, HTTP, MQTT, Blynk...). */
  sel: boolean;
  /** Reverses direction of the segment. Makes animations to go in the opposite direction. */
  rev: boolean;
  /** Turns on and off the individual segment. */
  on: boolean;
  /** Sets the individual segment brightness [0-255]. */
  bri: number;
  /** Segment name. */
  n: string; // TODO included in response but not in api doc https://kno.wled.ge/interfaces/json-api
  /** Color temperature. */ // TODO better description
  cct: number; // TODO included in response but not in api doc https://kno.wled.ge/interfaces/json-api
  // TODO how is this different from reverse??
  /** Mirrors the segment. */
  mi: boolean;
  /** Loxone RGB value for primary color. Each color (RRR,GGG,BBB) is specified in the range from 0 to 100% [0-100100100]. */
  lx: number;
  /** Loxone RGB value for secondary color. Each color (RRR,GGG,BBB) is specified in the range from 0 to 100% [0-100100100]. */
  ly: number;

  // Below are fields that can only be set for a POST request, they are never included in an API response.

  /** Zero-indexed ID of the segment. May be omitted, in that case the ID will be inferred from the order of the segment objects in the seg array. */
  id: number; // TODO `id` should have a ? for typescript
  /**
   * Using the `i` property of the segment object, you can set the LED colors in the segment using the JSON API. Keep in mind that this is non-persistent, if the light is turned off the segment will return to effect mode. The segment is blanked out when using individual control, the set effect will not run. To disable, change any property of the segment or turn off the light.
   *
   * To set individual LEDs starting from the beginning, use an array of Color arrays. `{"seg":{"i":[[255,0,0], [0,255,0], [0,0,255]]}}` will set the first LED red, the second green and the third blue.
   *
   * To set individual LEDs, use the LED index followed by its Color array. `{"seg":{"i":[0,[255,0,0], 2,[0,255,0], 4,[0,0,255]]}}` is the same as above, but leaves blank spaces between the lit LEDs.
   *
   * To set ranges of LEDs, use the LED start and stop index followed by its Color array. `{"seg":{"i":[0,8,[255,0,0], 10,18,[0,0,255]]}}` sets the first eight LEDs to red, leaves out two, and sets another 8 to blue.
   *
   * Keep in mind that the LED indices are segment-based, so LED 0 is the first LED of the segment, not of the entire strip. Segment features, including Grouping, Spacing, Mirroring and Reverse are functional.
   */
  i?: Array<number | number[]>;
}

export interface WledPlaylistSettings {
  /** Array of preset ID integers to be applied in this order. */
  ps: number[];
  /** Array of time each preset should be kept, in tenths of seconds. If only one integer is supplied, all presets will be kept for that time. Defaults to 10 seconds (`dur` = 100) if not provided. */
  dur: number[];
  /** Array of time each preset should transition to the next one, in tenths of seconds. If only one integer is supplied, all presets will transition for that time. Defaults to the current transition time if not provided. */
  transition: number;
  /** How many times the entire playlist should cycle before finishing. Set to `0 for an infinite cycle. Default to infinite if not provided. */
  repeat: number;
  /** Single preset ID to apply after the playlist finished. Has no effect when an infinite cycle is set. If not provided, the light will stay on the last preset of the playlist. */
  end: number;
}

export interface WledInfo {
  /** Version name. */
  readonly ver: string;
  /** Build ID (YYMMDDB, B = daily build index). */
  readonly vid: number;
  /** Info about the LED setup. */
  readonly leds: WledLedOverview;
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
  /** Number of currently connected WebSockets clients [-1 to 8]. -1 indicates that WS is unsupported in this build. */
  readonly ws: number;
  /** Number of effects included. */
  readonly fxcount: number;
  /** Number of palettes configured. */
  readonly palcount: number;
  /** Info about the wifi signal strength. */
  readonly wifi: WledWifiStats;
  /** Info about the embedded LittleFS filesystem. */
  readonly fs: WledFileSystemStats;
  /** Number of other WLED devices discovered on the network [-1 to 255]. -1 if Node discovery disabled. */
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
  /** The IP address of this instance. Empty string if not connected. */
  readonly ip: string;
}

export interface WledLedOverview {
  /** Total LED count [1-1200]. */
  readonly count: number;
  /** Current frames per second [0-255]. */
  readonly fps: number;
  /** `true` if LEDs are 4-channel (RGBW). */
  readonly rgbw: boolean;
  /** `true` if a white channel slider should be displayed. */
  readonly wv: boolean;
  /** Current LED power usage in milliamps as determined by the ABL. `0` if ABL is disabled [0-65000]. */
  readonly pwr: number;
  /** Maximum power budget in milliamps for the ABL. `0` if ABL is disabled [0-65000]. */
  readonly maxpwr: number;
  /** Maximum number of segments supported by this version. */
  readonly maxseg: number;
}

export interface WledWifiStats {
  /** The BSSID of the currently connected network. */
  readonly bssid: string;
  /** Relative signal quality of the current connection [0-100]. */
  readonly signal: number;
  /** The current WiFi channel [1-14]. */
  readonly channel: number;
}

export interface WledFileSystemStats {
  /** Estimate of used filesystem space in kilobytes. */
  readonly u: number;
  /** Total filesystem size in kilobytes. */
  readonly t: number;
  /** Unix timestamp for the last modification to the `presets.json` file. Not accurate after boot or after using `/edit`. */
  readonly pmt: number;
}

export interface APIPlaylists { [key: number]: APIPlaylist }
export interface APIPlaylist {
  /** Preset IDs in this playlist */
  ps: number[];
  /** Duration of each preset in `ps` */
  dur: number[];
  transition: number[];
  repeat: number;
  end: number | null;
  /** Toggle shuffle on/off */
  r: boolean;
}

export interface APIPresets { [key: number]: APIPreset }

export interface APIPreset {
  /** Preset name */
  n: string
  /** Playlist associated with this preset */
  playlist: APIPlaylist
  psave: number
  o: boolean
  /** backup stringified json */
  win: string
  /** Quick load label */
  ql: string
  on: boolean
  /** Include brightness */
  ib: boolean
  /** Save segment bounds */
  sb: boolean

  p: any // TODO seems to be used?

  // v: boolean
  // time: number
}

interface SavePresetRequestBase {
  psave: number
  n: string
  ql: string
}
export interface SavePresetRequest1 extends SavePresetRequestBase {
  ib: boolean
  sb: boolean
}
// TODO define the specific properties of the partial state
export type SavePresetRequest2 = SavePresetRequestBase & Partial<WledState>
export type SavePresetRequest = SavePresetRequest1 | SavePresetRequest2
