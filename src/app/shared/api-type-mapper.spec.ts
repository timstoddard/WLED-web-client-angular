import { TestBed } from '@angular/core/testing';
import { ApiTypeMapper } from './api-type-mapper';
import { WLEDFileSystemInfo, WLEDInfo, WLEDLedInfo, WLEDWifiInfo } from './api-types/api-info';
import { WLEDNodesResponse } from './api-types/api-nodes';
import { WLEDPresets } from './api-types/api-presets';
import { WLEDNightLightState, WLEDSegment, WLEDState, WLEDUdpState } from './api-types/api-state';
import { WLEDApiResponse } from './api-types/api-types';
import { DEFAULT_APP_STATE } from './app-state/app-state-defaults';
import { AppEffect, EffectDimension } from './app-types/app-effects';
import { AppFileSystemInfo, AppInfo, AppLedInfo, AppWifiInfo } from './app-types/app-info';
import { AppNode } from './app-types/app-nodes';
import { AppNightLightState, AppSegment, AppUdpState, AppWLEDState } from './app-types/app-state';
import { AppState } from './app-types/app-types';
import { ClientOnlyFieldsService } from './client-only-fields.service';
import { EffectsDataService } from './effects-data.service';

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
  sgrp: 1,
  rgrp: 1,
};

const MOCK_WLED_SEGMENTS: WLEDSegment[] = [
  {
    id: 0,
    start: 0,
    stop: 10,
    startY: 0,
    stopY: 0,
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
    c1: 0,
    c2: 0,
    c3: 0,
    o1: false,
    o2: false,
    o3: false,
    pal: 1,
    sel: true,
    rev: false,
    rY: false,
    on: true,
    bri: 255,
    mi: false,
    mY: false,
    tp: false,
    cct: 1,
    lx: 0,
    ly: 0,
    frz: false,
    m12: 0,
    si: 0,
    fxdef: false,
    set: 0,
    rpt: false,
    n: 'test',
  },
];

const MOCK_WLED_STATE: WLEDState = {
  on: true,
  bri: 128,
  transition: 3,
  ps: 1,
  pl: -1,
  nl: MOCK_WLED_NIGHTLIGHT,
  udpn: MOCK_WLED_UDP,
  lor: 0,
  mainseg: 0,
  seg: MOCK_WLED_SEGMENTS,
};

const MOCK_WLED_LED_INFO: WLEDLedInfo = {
  count: 101,
  fps: 60,
  pwr: 8,
  maxpwr: 12,
  maxseg: 3,
  lc: 4,
  seglc: [4],
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

const MOCK_WLED_EFFECTS: string[] = [
  'effect_1',
  'effect_2',
  'effect_3',
];

const MOCK_WLED_EFFECTS_DATA: string[] = [
  '!;!,!;!',
  '!;;!',
  '!;!;!',
];

const MOCK_APP_EFFECTS: AppEffect[] = [
  {
    id: 0,
    name: 'Solid',
    parameterLabels: [''],
    colorLabels: ['Fx', '', ''],
    segmentSettings: {},
    usesPalette: false,
    usesVolume: false,
    usesFrequency: false,
    dimensions: [EffectDimension.ONE],
    effectDataString: ';!;',
  },
  {
    id: 1,
    name: 'effect_2',
    parameterLabels: ['!'],
    colorLabels: [],
    segmentSettings: {},
    usesPalette: true,
    usesVolume: false,
    usesFrequency: false,
    dimensions: [EffectDimension.ONE],
    effectDataString: '!;;!',
  },
  {
    id: 2,
    name: 'effect_3',
    parameterLabels: ['!'],
    colorLabels: ['Fx', '', ''],
    segmentSettings: {},
    usesPalette: true,
    usesVolume: false,
    usesFrequency: false,
    dimensions: [EffectDimension.ONE],
    effectDataString: '!;!;!',
  },
];

const MOCK_WLED_API_RESPONSE: WLEDApiResponse = {
  state: MOCK_WLED_STATE,
  info: MOCK_WLED_INFO,
  palettes: MOCK_PALETTES,
  effects: MOCK_WLED_EFFECTS,
};

const MOCK_WLED_PRESETS: WLEDPresets = {
  // TODO
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
  sendGroup: 1,
  receiveGroup: 1,
};

const MOCK_APP_SEGMENTS: AppSegment[] = [
  {
    id: 0,
    startColumn: 0,
    stopColumn: 10,
    startRow: 0,
    stopRow: 0,
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
    effectCustom1: 0,
    effectCustom2: 0,
    effectCustom3: 0,
    effectOption1: false,
    effectOption2: false,
    effectOption3: false,
    paletteId: 1,
    isSelected: true,
    isHorizontallyReversed: false,
    isVerticallyReversed: false,
    isOn: true,
    brightness: 255,
    isHorizonallyMirrored: false,
    isVerticallyMirrored: false,
    isTransposed: false,
    colorTemp: 1,
    loxonePrimaryColor: 0,
    loxoneSecondaryColor: 0,
    isFrozen: false,
    expandEffect1D: 0,
    soundSimulationType: 0,
    forceEffectMetadataDefaults: false,
    setId: 0,
    isRepeated: false,
    name: 'test',
    isExpanded: false,
  },
];

const MOCK_APP_WLED_STATE: AppWLEDState = {
  on: true,
  brightness: 128,
  transition: 0.3,
  currentPresetId: 1,
  currentPlaylistId: -1,
  nightLight: MOCK_APP_NIGHTLIGHT,
  udp: MOCK_APP_UDP,
  liveViewOverride: 0,
  mainSegmentId: 0,
  segments: MOCK_APP_SEGMENTS,
};

const MOCK_APP_LED_INFO: AppLedInfo = {
  totalLeds: 101,
  fps: 60,
  amps: 8,
  maxAmps: 12,
  maxSegments: 3,
  lightCapabilities: 4,
  segmentLightCapabilities: [4],
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
  effects: MOCK_APP_EFFECTS,
  localSettings: DEFAULT_APP_STATE.localSettings,
  nodes: DEFAULT_APP_STATE.nodes,
  presets: [], // TODO add
};

// TODO get these unit tests to succeed
fdescribe('ApiTypeMapper', () => {
  let apiTypeMapper: ApiTypeMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiTypeMapper,
        ClientOnlyFieldsService,
        EffectsDataService,
        // { provide: StateApiService, useValue: {} },
        // { provide: AppStateService, useValue: {} },
        // { provide: ApiTypeMapper, useValue: {} },
      ],
    });
    apiTypeMapper = TestBed.inject(ApiTypeMapper);
  });

  it('mapWLEDApiResponseToAppState should work', () => {
    // assemble
    // n/a

    // act
    const appState = apiTypeMapper.mapWLEDApiResponseToAppState(
      DEFAULT_APP_STATE,
      MOCK_WLED_API_RESPONSE,
      MOCK_WLED_EFFECTS_DATA,
      MOCK_WLED_PRESETS,
    );

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
        } = apiTypeMapper.normalizeIds(items, 'id');

        // assert
        for (let i = 0; i < ids.length; i++) {
          expect(ids[i]).toBe(expectedIds[i]);
        }
        expect(nextId).toBe(expectedNextId);
      });
    }
  });
});
