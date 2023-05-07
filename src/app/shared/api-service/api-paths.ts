export enum ApiFilePath {
  CONFIG_JSON_FILE = 'cfg.json',
  PRESETS_JSON_FILE = 'presets.json',
  SECURITY_SETTINGS_JS_PATH = 'settings/s.js?p=6',
}

export enum ApiPath {
  // json api
  ALL_JSON_PATH = 'json',
  STATE_INFO_PATH = 'json/si',
  STATE_PATH = 'json/state',
  INFO_PATH = 'json/info',
  EFFECTS_PATH = 'json/eff',
  PALETTES_PATH = 'json/pal',
  PALETTES_DATA_PATH = 'json/palx',
  LIVE_PATH = 'json/live',
  NODES_PATH = 'json/nodes',
  // settings pages
  LED_SETTINGS_PATH = 'settings/leds',
  UI_SETTINGS_PATH = 'settings/ui',
  SECURITY_SETTINGS_PATH = 'settings/sec',
  WIFI_SETTINGS_PATH = 'settings/wifi',
  // other paths
  FILE_UPLOAD_PATH = 'upload',
}
