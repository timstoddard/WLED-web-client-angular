import { ApiTypeMapper } from './api-type-mapper';
import { WLEDApiResponse, WLEDFileSystemInfo, WLEDInfo, WLEDLedInfo, WLEDNightLightState, WLEDNodesResponse, WLEDSegment, WLEDState, WLEDUdpState, WLEDWifiInfo } from './api-types';
import { DEFAULT_APP_STATE } from './app-state/app-state-defaults';
import { AppFileSystemInfo, AppInfo, AppLedInfo, AppNightLightState, AppNode, AppSegment, AppState, AppUdpState, AppWifiInfo, AppWLEDState } from './app-types';

/* Set up all mocks for WLED types. */

const MOCK_WLED_NIGHTLIGHT: WLEDNightLightState = {
  on: true,
  dur: 6,
  mode: 1,
  tbri: 10,
  rem: 100,
};

const MOCK_WLED_UDP: WLEDUdpState = {
  send: true,
  recv: false,
};

const MOCK_WLED_SEGMENTS: WLEDSegment[] = [
  {
    id: 0,
    start: 0,
    stop: 10,
    len: 10,
    grp: 1,
    spc: 0,
    of: 0,
    col: [
      [255,0,0],
      [0,255,0],
      [0,0,255],
    ],
    fx: 1,
    sx: 128,
    ix: 128,
    pal: 1,
    sel: true,
    rev: false,
    on: true,
    bri: 255,
    n: 'name',
    cct: 1,
    mi: false,
  },
];

const MOCK_WLED_STATE: WLEDState = {
  on: true,
  bri: 128,
  transition: 3,
  ps: 1,
  pl: 2,
  nl: MOCK_WLED_NIGHTLIGHT,
  udpn: MOCK_WLED_UDP,
  lor: 0,
  mainseg: 0,
  seg: MOCK_WLED_SEGMENTS,
};

const MOCK_WLED_LED_INFO: WLEDLedInfo = {
  count: 101,
  fps: 60,
  rgbw: false,
  wv: false,
  pwr: 8,
  maxpwr: 12,
  maxseg: 3,
};

const MOCK_WLED_WIFI_INFO: WLEDWifiInfo = {
  bssid: 'bssid',
  rssi: 23,
  signal: 67,
  channel: 5,
};

const MOCK_WLED_FILESYSTEM_INFO: WLEDFileSystemInfo = {
  u: 123,
  t: 321,
  pmt: 9999,
};

const MOCK_WLED_INFO: WLEDInfo = {
  ver: 'version_name',
  vid: 123,
  leds: MOCK_WLED_LED_INFO,
  str: false,
  name: 'name',
  udpport: 1000,
  live: true,
  lm: 'lm',
  lip: '1.2.3.4',
  ws: 2,
  fxcount: 57,
  palcount: 89,
  wifi: MOCK_WLED_WIFI_INFO,
  fs: MOCK_WLED_FILESYSTEM_INFO,
  ndc: 3,
  arch: 'platform_name',
  core: '123',
  freeheap: 69,
  uptime: 987,
  opt: 21,
  brand: 'brand_name',
  product: 'product_name',
  mac: 'aa:bb:cc:dd:ee:ff',
  ip: '4.3.2.1',
};

const MOCK_PALETTES: string[] = [
  'palette_1',
  'palette_2',
  'palette_3',
];

const MOCK_EFFECTS: string[] = [
  'effect_1',
  'effect_2',
  'effect_3',
];

const MOCK_WLED_API_RESPONSE: WLEDApiResponse = {
  state: MOCK_WLED_STATE,
  info: MOCK_WLED_INFO,
  palettes: MOCK_PALETTES,
  effects: MOCK_EFFECTS,
};

/* Set up all mocks for APP types. */

const MOCK_APP_NIGHTLIGHT: AppNightLightState = {
  on: true,
  durationMinutes: 6,
  mode: 1,
  targetBrightness: 10,
  remainingSeconds: 100,
};

const MOCK_APP_UDP: AppUdpState = {
  shouldSend: true,
  shouldReceive: false,
};

const MOCK_APP_SEGMENTS: AppSegment[] = [
  {
    id: 0,
    isExpanded: false,
    start: 0,
    stop: 10,
    length: 10,
    group: 1,
    space: 0,
    startOffset: 0,
    colors: [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
    ],
    effectId: 1,
    effectSpeed: 128,
    effectIntensity: 128,
    paletteId: 1,
    isSelected: true,
    isReversed: false,
    isOn: true,
    brightness: 255,
    name: 'name',
    colorTemp: 1,
    isMirrored: false,
  },
];

const MOCK_APP_WLED_STATE: AppWLEDState = {
  on: true,
  brightness: 128,
  transition: 0.3,
  currentPresetId: 1,
  currentPlaylistId: 2,
  nightLight: MOCK_APP_NIGHTLIGHT,
  udp: MOCK_APP_UDP,
  liveViewOverride: 0,
  mainSegmentId: 0,
  segments: MOCK_APP_SEGMENTS,
};

const MOCK_APP_LED_INFO: AppLedInfo = {
  totalLeds: 101,
  fps: 60,
  hasWhiteChannel: false,
  showWhiteChannelSlider: false,
  amps: 8,
  maxAmps: 12,
  maxSegments: 3,
};

const MOCK_APP_WIFI_INFO: AppWifiInfo = {
  bssid: 'bssid',
  rssi: 23,
  signalStrength: 67,
  channel: 5,
};

const MOCK_APP_FILESYSTEM_INFO: AppFileSystemInfo = {
  usedSpaceKb: 123,
  totalSpaceKb: 321,
  presetsJsonLastEditTimestamp: 9999,
};

const MOCK_APP_INFO: AppInfo = {
  versionName: 'version_name',
  versionId: 123,
  ledInfo: MOCK_APP_LED_INFO,
  shouldToggleReceiveWithSend: false,
  name: 'name',
  udpPort: 1000,
  isLive: true,
  lm: 'lm',
  sourceIpAddress: '1.2.3.4',
  webSocketCount: 2,
  effectCount: 57,
  paletteCount: 89,
  wifi: MOCK_APP_WIFI_INFO,
  fileSystem: MOCK_APP_FILESYSTEM_INFO,
  wledDevicesOnNetwork: 3,
  platform: 'platform_name',
  arduinoVersion: '123',
  freeHeapBytes: 69,
  uptimeSeconds: 987,
  opt: 21,
  brand: 'brand_name',
  productName: 'product_name',
  macAddress: 'aa:bb:cc:dd:ee:ff',
  ipAddress: '4.3.2.1',
};

const EXPECTED_APP_STATE: AppState = {
  state: MOCK_APP_WLED_STATE,
  info: MOCK_APP_INFO,
  palettes: MOCK_PALETTES,
  effects: MOCK_EFFECTS,
  localSettings: DEFAULT_APP_STATE.localSettings,
  nodes: DEFAULT_APP_STATE.nodes,
};

fdescribe('ApiTypeMapper', () => {
  let apiTypeMapper: ApiTypeMapper;

  beforeEach(() => {
    apiTypeMapper = new ApiTypeMapper();
  });

  it('mapWLEDApiResponseToAppState should work', () => {
    // assemble
    // n/a

    // act
    const appState = apiTypeMapper.mapWLEDApiResponseToAppState(MOCK_WLED_API_RESPONSE, DEFAULT_APP_STATE);

    // assert
    expect(appState).toEqual(EXPECTED_APP_STATE);
  });

  it('mapWLEDNodesToAppNodes should work', () => {
    // assemble
    const MOCK_WLED_NODES: WLEDNodesResponse = {
      nodes: [
        {
          name: 'node 1',
          ip: '1.1.1.1',
          type: 1,
          vid: '100',
        },
        {
          name: 'node 2',
          ip: '2.2.2.2',
          type: 1,
          vid: '200',
        },
        {
          name: 'node 3',
          ip: '3.3.3.3',
          type: 2,
          vid: '300',
        },
      ]
    };
    const MOCK_APP_NODES: AppNode[] = [
      {
        name: 'node 1',
        ipAddress: '1.1.1.1',
        type: 1,
        versionId: '100',
      },
      {
        name: 'node 2',
        ipAddress: '2.2.2.2',
        type: 1,
        versionId: '200',
      },
      {
        name: 'node 3',
        ipAddress: '3.3.3.3',
        type: 2,
        versionId: '300',
      },
    ];

    // act
    const appNodes = apiTypeMapper.mapWLEDNodesToAppNodes(MOCK_WLED_NODES);

    // assert
    expect(appNodes).toEqual(MOCK_APP_NODES);
  });

  describe('normalizeIds', () => {
    interface TestCase {
      description: string;
      items: Array<{ id?: number }>;
      expectedIds: number[];
      expectedNextId: number;
    }
 
    const testCases: TestCase[] = [
      {
        description: 'should map items that all have IDs, in ascending order',
        items: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
        ],
        expectedIds: [1, 2, 3, 4],
        expectedNextId: 5,
      },
      {
        description: 'should map items that all have IDs, that are out of order',
        items: [
          { id: 4 },
          { id: 1 },
          { id: 3 },
          { id: 2 },
        ],
        expectedIds: [4, 1, 3, 2],
        expectedNextId: 5,
      },
      {
        description: 'should map items where some have missing IDs, that are in order',
        items: [
          { id: 1 },
          {},
          { id: 2 },
          {},
          { id: 4 },
          {},
          { id: 7 },
          { id: 11 },
        ],
        expectedIds: [1, 3, 2, 5, 4, 6, 7, 11],
        expectedNextId: 8,
      },
      {
        description: `should map items where some have missing IDs, that are out of order`,
        items: [
          { id: 1 },
          {},
          { id: 4 },
          {},
          { id: 11 },
          {},
          { id: 2 },
        ],
        expectedIds: [1, 3, 4, 5, 11, 6, 2],
        expectedNextId: 7,
      },
    ];

    for (const testCase of testCases) {
      it(testCase.description, () => {
        // assemble
        const {
          items,
          expectedIds,
          expectedNextId,
        } = testCase;

        // act
        const {
          ids,
          nextId,
        } = apiTypeMapper.normalizeIds(items);

        // assert
        for (let i = 0; i < ids.length; i++) {
          expect(ids[i]).toBe(expectedIds[i]);
        }
        expect(nextId).toBe(expectedNextId);
      });
    }
  });
});
