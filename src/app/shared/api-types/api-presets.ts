export interface WLEDPresets { [key: number]: WLEDPreset }

// TODO verify fields and their types & descriptions
export interface WLEDPreset {
  /** Preset name */
  n: string;
  /** Playlist associated with this preset */
  playlist: WLEDPlaylist; // TODO how is this used?
  // psave: number;
  o: boolean;
  /** backup stringified json */
  win: string;
  /** Quick load label */
  ql: string;
  on: boolean;
  /** Include brightness */
  ib: boolean;
  /** Save segment bounds */
  sb: boolean;

  p: any; // TODO seems to be used?
}

export interface WLEDPlaylists { [key: number]: WLEDPlaylist }

export interface WLEDPlaylist {
  /** Array of preset IDs to be applied in order. */
  ps: number[];
  /** Array of times each preset should be kept, in tenths of a second. If only one integer is supplied, all presets will be kept for that time. Defaults to 10 seconds if not provided. */
  dur?: number[] | number;
  /** Array of times each preset should transition to the next one, in tenths of a second. If only one integer is supplied, all presets will transition for that time. Defaults to the current transition time if not provided. */
  transition?: number[] | number;
  /** Number of times the entire playlist will cycle before finishing. Set to 0 for an infinite cycle. Defaults to infinite if not provided. */
  repeat?: number;
  /** Single preset ID to apply after the playlist is finished. Has no effect when an infinite cycle is set. If not provided, the light will stay on the last preset of the playlist. */
  end?: number;
}
