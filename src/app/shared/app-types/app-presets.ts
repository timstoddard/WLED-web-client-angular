export interface AppPreset {
  /** Preset ID. */
  id: number;
  /** Preset name. */
  name: string;
  /** Optional label for quick load button. */
  quickLoadLabel: string;
  /** WLED config for this preset. */
  apiValue: string; // TODO make this an interface type
  /** `true` if the preset is expanded. (client-only property) */
  isExpanded: boolean;
}

export interface AppPlaylist {
  /** Preset IDs in this playlist */
  presetIds: number[];
  /** Array of times each preset should be kept, in tenths of a second. If only one integer is supplied, all presets will be kept for that time. Defaults to 10 seconds if not provided. */
  duration?: number[] | number;
  /** Array of times each preset should transition to the next one, in tenths of a second. If only one integer is supplied, all presets will transition for that time. Defaults to the current transition time if not provided. */
  transition?: number[] | number;
  /** Number of times the entire playlist will cycle before finishing. Set to 0 for an infinite cycle. Defaults to infinite if not provided. */
  repeat?: number;
  /** Single preset ID to apply after the playlist is finished. Has no effect when an infinite cycle is set. If not provided, the light will stay on the last preset of the playlist. */
  end?: number;
}
