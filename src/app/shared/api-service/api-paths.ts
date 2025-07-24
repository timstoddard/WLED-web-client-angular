// TODO remove "path" from all the enum keys
export enum ApiFilePath {
  CONFIG_JSON_FILE = 'cfg.json',
  PRESETS_JSON_FILE = 'presets.json',
  WIFI_SETTINGS_JS_PATH = 'settings/s.js?p=1',
  LED_SETTINGS_JS_PATH = 'settings/s.js?p=2',
  UI_SETTINGS_JS_PATH = 'settings/s.js?p=3',
  SYNC_SETTINGS_JS_PATH = 'settings/s.js?p=4',
  TIME_SETTINGS_JS_PATH = 'settings/s.js?p=5',
  SECURITY_SETTINGS_JS_PATH = 'settings/s.js?p=6',
  // only used if DMX is enabled in WLED
  DMX_SETTINGS_JS_PATH = 'settings/s.js?p=7',
  USER_MOD_SETTINGS_JS_PATH = 'settings/s.js?p=8',
  // update page, for PIN check
  UPDATE_SETTINGS_JS_PATH = 'settings/s.js?p=9',
  // only used if 2D is enabled in WLED
  _2D_SETTINGS_JS_PATH = 'settings/s.js?p=10',
}

// TODO remove "path" from all the enum keys
export enum ApiPath {
  // json api
  ALL_JSON_PATH = 'json',
  STATE_INFO_PATH = 'json/si',
  STATE_PATH = 'json/state',
  INFO_PATH = 'json/info',
  EFFECTS_PATH = 'json/eff',
  EFFECTS_DATA_PATH = 'json/fxdata',
  PALETTES_PATH = 'json/pal',
  PALETTES_DATA_PATH = 'json/palx',
  LIVE_PATH = 'json/live',
  NODES_PATH = 'json/nodes',
  // settings pages
  NETWORK_SETTINGS_PATH = 'settings/wifi',
  LED_SETTINGS_PATH = 'settings/leds',
  UI_SETTINGS_PATH = 'settings/ui',
  SYNC_SETTINGS_PATH = 'settings/sync',
  TIME_SETTINGS_PATH = 'settings/time',
  SECURITY_SETTINGS_PATH = 'settings/sec',
  DMX_SETTINGS_PATH = 'settings/dmx',
  USERMOD_SETTINGS_PATH = 'settings/um',
  UPDATE_SETTINGS_PATH = 'settings/update',
  _2D_SETTINGS_PATH = 'settings/2D',
  // other paths
  FILE_UPLOAD_PATH = 'upload',
  VERSION = 'version',
  UPTIME = 'uptime',
}
