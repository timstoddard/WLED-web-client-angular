import { WLEDPlaylist } from './api-presets';
import { WLEDSegment, WLEDState } from './api-state';

// TODO use these in API service

export interface WLEDStatePostRequest extends WLEDState {
  /** [0-255] Similar to transition, but applies to just the current API call. */
  tt?: number;
  /** [1-16] Save current light config to specified preset slot. */
  psave?: number;
  /** If `true`, device will reboot immediately. */
  rb?: boolean;
  /** If set to `true`, enters realtime mode and blanks the LEDs. The realtime timeout option does not have an effect when this command is used, WLED will stay in realtime mode until the state (color/effect/segments, excluding brightness) is changed. It is expected that `{"live":false}` is sent once live data sending is terminated. */
  live?: true;
  /** Set module time to the specified unix timestamp. */
  time?: number;
  /** Custom preset playlists. */
  playlist?: WLEDPlaylist;
  /** Sets timebase for effects. */
  tb?: number;
}

type WLEDSegmentFiltered = Omit<
  WLEDSegment,
  'fx' | 'sx' | 'ix' | 'pal' | 'lx' | 'ly'
>;
export interface WLEDSegmentPostRequest extends WLEDSegmentFiltered {
  /** [0-`info.fxcount - 1`] Effect ID.
   * 
   * Special values:
   * - `~` to increment
   * - `~-` to decrement
   * - `r` for random
   */
  fx?: number | '~' | '~-' | 'r';
  /** [0-255] Effect speed.
   * 
   * Special values:
   * - `~` to increment
   * - `~-` to decrement
   * - `~10` to increment by 10
   * - `~-10` to decrement by 10
   */
  sx?: number | '~' | '~-' | '~10' | '~-10';
  /** [0-255] Effect intensity.
   * 
   * Special values:
   * - `~` to increment
   * - `~-` to decrement
   * - `~10` to increment by 10
   * - `~-10` to decrement by 10
   */
  ix?: number | '~' | '~-' | '~10' | '~-10';
  /** [0-`info.palcount - 1`] Color palette ID.
   * 
   * Special values:
   * - `~` to increment
   * - `~-` to decrement
   * - `r` for random
   */
  pal?: number | '~' | '~-' | 'r';
  /** Loxone primary color.
   * 
   * There are 2 options for setting this value:
   * 
   * 1. [`BBBGGGRRR`: 0-100100100] Set the RGB values. Each color (`RRR`,`GGG`,`BBB`) is specified in the range from `0` to `100%`.
   * 1. [`20bbbtttt`: 200002700-201006500] Set the brightness and color temperature values. Brightness `bbb` is specified in the range `0` to `100%`. `tttt` defines the color temperature in the range from `2700` to `6500` Kelvin.
   */
  lx?: number;
  /** Loxone secondary color.
   * 
   * There are 2 options for setting this value:
   * 
   * 1. [`BBBGGGRRR`: 0-100100100] Set the RGB values. Each color (`RRR`,`GGG`,`BBB`) is specified in the range from `0` to `100%`.
   * 1. [`20bbbtttt`: 200002700-201006500] Set the brightness and color temperature values. Brightness `bbb` is specified in the range `0` to `100%`. `tttt` defines the color temperature in the range from `2700` to `6500` Kelvin.
   */
  ly?: number;
  /**
   * Using the `i` property of the segment object, you can set the LED colors in the segment using the JSON API. Keep in mind that this is non-persistent, if the light is turned off the segment will return to effect mode. The segment is blanked out when using individual control, the set effect will not run. To disable, change any property of the segment or turn off the light.
   *
   * To set individual LEDs starting from the beginning, use an array of Color arrays. `{"seg":{"i":[[255,0,0], [0,255,0], [0,0,255]]}}` will set the first LED red, the second green and the third blue.
   *
   * To set individual LEDs, use the LED index followed by its Color array. `{"seg":{"i":[0,[255,0,0], 2,[0,255,0], 4,[0,0,255]]}}` is the same as above, but leaves blank spaces between the lit LEDs.
   *
   * To set ranges of LEDs, use the LED start and stop index followed by its Color array. `{"seg":{"i":[0,8,[255,0,0], 10,18,[0,0,255]]}}` sets the first eight LEDs to red, leaves out two, and sets another 8 to blue.
   *
   * Keep in mind that the LED indices are segment-based, so LED 0 is the first LED of the segment, not of the entire strip. Segment features, including Grouping, Spacing, Mirroring and Reverse are functional. This feature is available in build 200829 and above.
   * 
   * Note: For your colors to apply correctly, make sure the desired brightness is set beforehand. Turning on the LEDs from an off state and setting individual LEDs in the same JSON request will not work!
   */
  i?: Array<number | number[]>;
}

export interface WLEDUdpStatePostRequest {
  /** Don't send a broadcast packet (applies to just the current API call). */
  nn?: boolean;
}

// TODO clean up preset types & logic
interface SavePresetRequestBase {
  psave: number;
  n: string;
  ql: string;
}
export interface SavePresetRequest1 extends SavePresetRequestBase {
  ib: boolean;
  sb: boolean;
}
// TODO define the specific properties of the partial state
export type SavePresetRequest2 = SavePresetRequestBase & Partial<WLEDState>;
export type SavePresetRequest = SavePresetRequest1 | SavePresetRequest2;
