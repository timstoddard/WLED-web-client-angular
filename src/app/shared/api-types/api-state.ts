export interface WLEDState {
  /** On/Off state of the light. You can also use `'t'` instead of `true` or `false` to toggle. */
  on: boolean;
  /** [0 - 255] Brightness of the light. If `on` is `false`, contains last brightness when light was on. Setting `bri` to `0` is supported but it is recommended to use the range `1-255` and use `on: false` to turn off. The state response will never have the value `0` for `bri`. */
  bri: number;
  /** [0 - 65535] Duration of the crossfade between different colors/brightness levels. One unit is 100ms, so a value of 4 results in a transition of 400ms. */
  transition: number;
  /** [-1 - 250] ID of currently set preset. */
  ps: number;
  /** [-1 - 250] ID of currently set playlist. */
  readonly pl: number;
  /** Nightlight settings. */
  nl: WLEDNightLightState;
  /** UDP settings. */
  udpn: WLEDUdpState;
  /** [0 - 2] Live data override. 0 is off, 1 is override until live data ends, 2 is override until ESP reboot. */
  lor: 0 | 1 | 2;
  /** [0 - `info.leds.maxseg-1`] ID of main segment. */
  mainseg: number;
  /** List of configured segments. Segments are individual parts of the LED strip. */
  seg: WLEDSegment[];
}

export interface WLEDNightLightState {
  /** `true` if nightlight currently active. */
  on: boolean;
  /** [1 - 255] Duration of nightlight in minutes. */
  dur: number;
  /** [0 - 3] Nightlight mode (0: instant, 1: fade, 2: color fade, 3: sunrise). */
  mode: 0 | 1 | 2 | 3;
  /** [0 - 255] Target brightness of nightlight feature. */
  tbri: number;
  /** Remaining nightlight duration in seconds, `-1` if not active. Only in state response, cannot be set. */
  readonly rem: number;
}

export interface WLEDUdpState {
  /** Send WLED broadcast (UDP sync) packet on state change. */
  send: boolean;
  /** Receive broadcast packets. */
  recv: boolean;
  /** [0 - 255] Bitfield for broadcast send groups 1-8. */
  sgrp: number;
  /** [0 - 255] Bitfield for broadcast receive groups 1-8. */
  rgrp: number;
}

export interface WLEDSegment {
  /** Segment name. */
  n: string;
  /** [0 - `info.maxseg-1`] Zero-indexed ID of the segment. May be omitted from post request, in that case the ID will be inferred from the order of the segment objects in the `seg` array. */
  id: number;
  /** [0 - `info.leds.count-1`] LED the segment starts at. For 2D set-up it determines column where segment starts, from top-left corner of the matrix. */
  start: number;
  /** [0 - `info.leds.count`] LED the segment stops at, not included in range. If `stop` is set to a lower or equal value than `start` (setting to `0` is recommended), the segment is invalidated and deleted. For 2D set-up it determines column where segment stops, from top-left corner of the matrix. */
  stop: number;
  /** [0 - matrix width] Start row from top-left corner of a matrix. */
  startY: number;
  /** [1 - matrix height] Stop row from top-left corner of matrix. */
  stopY: number;
  /** [0 - `info.leds.count`] Length of the segment (`stop` - `start`). `stop` has precedence, so if it is included, `len` is ignored. */
  len: number;
  /** [0 - 255] Grouping: how many consecutive LEDs of the same segment will be grouped to the same color. */
  grp: number;
  /** [0 - 255] Spacing: how many LEDs are turned off and skipped between each group. */
  spc: number;
  /** [`-len+1` - `len`] Offset: how many LEDs to rotate the virtual start of the segments. */
  of: number;
  /** Array that has up to 3 color arrays as elements, the primary, secondary (background) and tertiary colors of the segment. Each color is an array of 3 or 4 bytes, which represents a RGB(W) color, e.g. `[[255,170,0],[0,0,0],[64,64,64]]`. It can also be represented as aan array of strings of hex values, e.g. `["FFAA00","000000","404040"]` for orange, black and grey. */
  col: number[][];
  /** [0 - `info.fxcount-1`] Effect ID. */
  fx: number;
  /** [0 - 255] Effect speed. */
  sx: number;
  /** [0 - 255] Effect intensity. */
  ix: number;
  /** [0 - 255] Effect custom slider 1. Custom sliders are hidden or displayed and labeled based on [effect metadata](https://kno.wled.ge/interfaces/json-api/#effect-metadata). */
  c1: number;
  /** [0 - 255] Effect custom slider 2. */
  c2: number;
  /** [0 - 31] Effect custom slider 3. */
  c3: number;
  /** Effect option 1. Custom options are hidden or displayed and labeled based on [effect metadata](https://kno.wled.ge/interfaces/json-api/#effect-metadata). */
  o1: boolean;
  /** Effect option 2. */
  o2: boolean;
  /** Effect option 3. */
  o3: boolean;
  /** [0 - `info.palcount-1`] Color palette ID. */
  pal: number;
  /** `true` if the segment is selected. Selected segments will have their state (color/FX) updated by APIs that don't support segments (e.g. UDP sync, HTTP API). If no segment is selected, the first segment (id: `0`) will behave as if selected. WLED will report the state of the first (lowest id) segment that is selected to APIs (HTTP, MQTT, Blynk...), or `mainseg` in case no segment is selected and for the UDP API. Live data is always applied to all LEDs regardless of segment configuration. */
  sel: boolean;
  /** Flips the segment (in horizontal dimension for 2D set-up), causing animations to change direction. */
  rev: boolean;
  /** Flips the 2D segment in vertical dimension. */
  rY: boolean;
  /** Turns on and off the individual segment. */
  on: boolean;
  /** [0 - 255] Sets the individual segment brightness. */
  bri: number;
  /** Mirrors the segment (in horizontal dimension for 2D set-up). */
  mi: boolean;
  /** Mirrors the 2D segment in vertical dimension. */
  mY: boolean;
  /** Transposes a segment (swaps X and Y dimensions). */
  tp: boolean;
  /** [0 - 255 (preferred) or 1900 - 10091] White spectrum color temperature.
   * 
   * `seg.cct` can always be set, but only has an effect on the physical state of the light if one or both of the following conditions is met:
   * - `White Balance correction` is enabled.
   * - A bus supporting CCT is configured and `Calculate CCT from RGB` is not enabled.
   * 
   * CCT support is indicated by `info.leds.cct` being `true`, in which case we can regard the instance as a CCT light (and e.g., display a color temperature control).
   */
  cct: number;
  /** [`BBBGGGRRR`: 0 - 100100100] Loxone RGB value for primary color. Each color (`RRR`,`GGG`,`BBB`) is specified in the range from `0` to `100%`. */
  lx: number;
  /** [`BBBGGGRRR`: 0 - 100100100] Loxone RGB value for secondary color. Each color (`RRR`,`GGG`,`BBB`) is specified in the range from `0` to `100%`. */
  ly: number;
  /** Freezes/unfreezes the current effect. */
  frz: boolean;
  /** Setting of segment field 'Expand 1D FX'. (0: Pixels, 1: Bar, 2: Arc, 3: Corner) */
  m12: number;
  /** Setting of the sound simulation type for audio enhanced effects. (0: 'BeatSin', 1: 'WeWillRockYou', 2: '10_3', 3: '14_3') */
  si: number;
  /** Forces loading of effect defaults (speed, intensity, etc) from [effect metadata](https://kno.wled.ge/interfaces/json-api/#effect-metadata). */
  fxdef: boolean;
  /** Assigns group or set ID to segment (not to be confused with grouping). Visual aid only (helps in UI). */
  set: number;
  /** Flag to repeat current segment settings by creating segments until all available LEDs are included in automatically created segments or maximum segments reached. Will also toggle reverse on every even segment. */
  rpt: boolean;
}
