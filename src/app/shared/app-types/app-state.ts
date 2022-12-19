export interface AppWLEDState {
  /** On/Off state of the light. */
  on: boolean;
  /** [0 - 255] Brightness of the light. If `on` is `false`, contains last brightness when light was on. Setting `bri` to `0` is supported but it is recommended to use the range `1-255` and use `on: false` to turn off. The state response will never have the value `0` for `bri`. */
  brightness: number;
  /** [0 - 255] Duration of the crossfade between different colors/brightness levels. One unit is 100ms, so a value of 4 results in a transition of 400ms. */
  transition: number;
  /** [-1 - 65535] ID of currently set preset. */
  currentPresetId: number;
  /** [-1 - 0] ID of currently set playlist. For now, this sets the preset cycle feature, `-1` is off and `0` is on. */
  currentPlaylistId: -1 | 0;
  /** Nightlight settings. */
  nightLight: AppNightLightState;
  /** UDP settings. */
  udp: AppUdpState;
  /** [0 - 2] Live data override. 0 is off, 1 is override until live data ends, 2 is override until ESP reboot. */
  liveViewOverride: 0 | 1 | 2;
  /** [0 - `info.leds.maxseg-1`] ID of main segment. */
  mainSegmentId: number;
  /** List of configured segments. Segments are individual parts of the LED strip. */
  segments: AppSegment[];
}

export interface AppNightLightState {
  /** `true` if nightlight currently active. */
  on: boolean;
  /** [1 - 255] Duration of nightlight in minutes. */
  durationMinutes: number;
  // TODO add support for this in UI (dropdown from button)
  /** [0 - 3] Nightlight mode (0: instant, 1: fade, 2: color fade, 3: sunrise). */
  mode: 0 | 1 | 2 | 3;
  /** [0 - 255] Target brightness of nightlight feature. */
  targetBrightness: number;
  /** Remaining nightlight duration in seconds, `-1` if not active. Only in state response, cannot be set. */
  remainingSeconds: number;
}

export interface AppUdpState {
  /** Send WLED broadcast (UDP sync) packet on state change. */
  shouldSend: boolean;
  /** Receive broadcast packets. */
  shouldReceive: boolean;
}

export interface AppSegment {
  /** Zero-indexed ID of the segment. */
  id: number;
  /** [0 - `info.leds.count-1`] LED the segment starts at. */
  start: number;
  /** [0 - `info.leds.count`] LED the segment stops at (excluded by range). If `stop` is set to a lower or equal value than `start` (setting to `0` is recommended), the segment is invalidated and deleted. */
  stop: number;
  /** [0 - `info.leds.count`] Length of the segment (`stop` - `start`). `stop` has precedence, so if it is included, `len` is ignored. */
  length: number;
  /** [0 - 255] Grouping: how many consecutive LEDs of the same segment will be grouped to the same color. */
  group: number;
  /** [0 - 255] Spacing: how many LEDs are turned off and skipped between each group. */
  space: number;
  /** [`-len+1` - `len`] Offset: how many LEDs to rotate the virtual start of the segments. */
  startOffset: number;
  /** Array that has up to 3 color arrays as elements, the primary, secondary (background) and tertiary colors of the segment. Each color is an array of 3 or 4 bytes, which represent an RGB(W) color. */
  colors: number[][];
  /** [0 - `info.fxcount-1`] Effect ID. */
  effectId: number;
  /** [0 - 255] Effect speed. */
  effectSpeed: number;
  /** [0 - 255] Effect intensity. */
  effectIntensity: number;
  /** [0 - `info.palcount-1`] Color palette ID. */
  paletteId: number;
  /** `true` if the segment is selected. Selected segments will have their state (color/FX) updated by APIs that don't support segments (currently any API except the JSON API). If no segment is selected, the first segment (id=0) will behave as if selected. WLED will report the state of the first (lowest id) segment that is selected, to APIs (HTTP, MQTT, Blynk, etc.) and for the UDP API, or mainseg in case no segment is selected. Live data is always applied to all LEDs regardless of segment configuration. */
  isSelected: boolean;
  /** Reverses direction of the segment, causing animations to change direction. */
  isReversed: boolean;
  /** Turns on and off the individual segment. */
  isOn: boolean;
  /** [0 - 255] Sets the individual segment brightness. */
  brightness: number;
  /** Mirrors the segment. */
  isMirrored: boolean;
  // TODO add handling logic for cct (see https://kno.wled.ge/interfaces/json-api/#cct-control)
  /** [0 - 255 (preferred) or 1900 - 10091] White spectrum color temperature.
   * 
   * `seg.cct` can always be set, but only has an effect on the physical state of the light if one or both of the following conditions is met:
   * - `White Balance correction` is enabled.
   * - A bus supporting CCT is configured and `Calculate CCT from RGB` is not enabled.
   * 
   * CCT support is indicated by `info.leds.cct` being `true`, in which case we can regard the instance as a CCT light (and e.g., display a color temperature control).
   */
  colorTemp: number;
  /** [`BBBGGGRRR`: 0 - 100100100] Loxone RGB value for primary color. Each color (`RRR`,`GGG`,`BBB`) is specified in the range from `0` to `100%`. */
  loxonePrimaryColor: number;
  /** [`BBBGGGRRR`: 0 - 100100100] Loxone RGB value for secondary color. Each color (`RRR`,`GGG`,`BBB`) is specified in the range from `0` to `100%`. */
  loxoneSecondaryColor: number;
  /** Freezes/unfreezes the current effect. */
  isFrozen: boolean;
  /** Segment name. (client-only property) */
  name: string;
  /** `true` if the segment is expanded. (client-only property) */
  isExpanded: boolean;
}
