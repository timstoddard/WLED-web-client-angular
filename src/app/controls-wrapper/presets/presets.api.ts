// TODO should probably move to api-types

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

export interface PresetError {
  isEmpty: boolean;
  message: string;
  backupString: string;
}
