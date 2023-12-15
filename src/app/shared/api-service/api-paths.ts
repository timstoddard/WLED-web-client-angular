export enum ApiFilePath {
  CONFIG_JSON_FILE = 'cfg.json',
  PRESETS_JSON_FILE = 'presets.json',
  WIFI_SETTINGS_JS_PATH = 'settings/s.js?p=1',
  TIME_SETTINGS_JS_PATH = 'settings/s.js?p=5',
  SECURITY_SETTINGS_JS_PATH = 'settings/s.js?p=6',
}

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
  LED_SETTINGS_PATH = 'settings/leds',
  SECURITY_SETTINGS_PATH = 'settings/sec',
  TIME_SETTINGS_PATH = 'settings/time',
  UI_SETTINGS_PATH = 'settings/ui',
  WIFI_SETTINGS_PATH = 'settings/wifi',
  // other paths
  FILE_UPLOAD_PATH = 'upload',
}
