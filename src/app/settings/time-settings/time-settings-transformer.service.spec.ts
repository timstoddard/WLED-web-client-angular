import { TestBed } from '@angular/core/testing';
import { TimeSettingsTransformerService } from './time-settings-transfomer.service';
import { TimeSettings, WledTimeSettings } from '../shared/settings-types';
import { ParsedMethodCall } from '../shared/api-response-parser.service';

fdescribe('TimeSettingsTransformerService', () => {
  let timeSettingsTransformerService: TimeSettingsTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeSettingsTransformerService,
      ],
    });
    timeSettingsTransformerService = TestBed.inject(TimeSettingsTransformerService);
  });

  it('should convert from WLED to app format', () => {
    const actualResult = timeSettingsTransformerService
      .transformWledTimeSettingsToTimeSettings(MOCK_WLED_TIME_SETTINGS, MOCK_WLED_BUTTON_ACTIONS);
    console.log('actualResult', actualResult)
    expect(actualResult).toEqual(MOCK_TIME_SETTINGS);
  });

  it('should convert from app to WLED format', () => {
    const actualResult = timeSettingsTransformerService
      .transformTimeSettingsToWledTimeSettings(MOCK_TIME_SETTINGS);
    expect(actualResult).toEqual(MOCK_WLED_TIME_SETTINGS_POST_VALUE);
  });
});

// without boolean checkbox settings
const MOCK_WLED_TIME_SETTINGS_BASE: Partial<WledTimeSettings> = {
  NS: '0.wled.pool.ntp.org',
  TZ: 0,
  UO: 0,
  LN: '0',
  LT: '0',
  O1: 1,
  O2: 50,
  OM: 0,
  CY: 25,
  CI: 4,
  CD: 20,
  CH: 11,
  CM: 59,
  CS: 30,
  A0: 1,
  A1: 2,
  MC: 3,
  MN: 4,
  MP0: 1,
  ML0: 2,
  MD0: 3,
  MP1: 4,
  ML1: 5,
  MD1: 6,
  MP2: 7,
  ML2: 8,
  MD2: 9,
  MP3: 10,
  ML3: 11,
  MD3: 12,
  // scheduled preset 0
  H0: 12,
  N0: 15,
  T0: 10,
  W0: 63,
  M0: 1,
  P0: 12,
  D0: 1,
  E0: 31,
  // scheduled preset 1
  H1: 0,
  N1: 0,
  T1: 0,
  W1: 193,
  M1: 1,
  P1: 12,
  D1: 1,
  E1: 31,
  // scheduled preset 3
  H2: 0,
  N2: 0,
  T2: 0,
  W2: 33,
  M2: 1,
  P2: 12,
  D2: 1,
  E2: 31,
  // scheduled preset 3
  H3: 0,
  N3: 0,
  T3: 0,
  W3: 0,
  M3: 1,
  P3: 12,
  D3: 1,
  E3: 31,
  // scheduled preset 4
  H4: 0,
  N4: 0,
  T4: 0,
  W4: 1,
  M4: 1,
  P4: 12,
  D4: 1,
  E4: 31,
  // scheduled preset 5
  H5: 0,
  N5: 0,
  T5: 0,
  W5: 2,
  M5: 1,
  P5: 12,
  D5: 1,
  E5: 31,
  // scheduled preset 6
  H6: 0,
  N6: 0,
  T6: 0,
  W6: 255,
  M6: 1,
  P6: 12,
  D6: 1,
  E6: 31,
  // scheduled preset 7
  H7: 0,
  N7: 0,
  T7: 0,
  W7: 254,
  M7: 1,
  P7: 12,
  D7: 1,
  E7: 31,
  // scheduled preset 8
  N8: 5,
  T8: 4,
  W8: 255,
  // scheduled preset 9
  N9: -5,
  T9: 0,
  W9: 255,
};

const MOCK_WLED_TIME_SETTINGS: WledTimeSettings = {
  ...MOCK_WLED_TIME_SETTINGS_BASE,
  NT: 0,
  CF: 1,
  OL: 0,
  O5: 1,
  OS: 0,
  CE: 0,
} as WledTimeSettings;

const MOCK_WLED_TIME_SETTINGS_POST_VALUE: WledTimeSettings = {
  ...MOCK_WLED_TIME_SETTINGS_BASE,
  // NT: 'on',
  CF: 'on',
  // OL: 'on',
  O5: 'on',
  // OS: 'on',
  // CE: 'on',
} as WledTimeSettings;

const MOCK_WLED_BUTTON_ACTIONS: ParsedMethodCall[] = [
  // button action 0
  ['addRow', [0, 1, 2, 3]],
  // button action 1
  ['addRow', [1, 4, 5, 6]],
  // button action 2
  ['addRow', [2, 7, 8, 9]],
  // button action 3
  ['addRow', [3, 10, 11, 12]],
];

const MOCK_TIME_SETTINGS: TimeSettings = {
  ntpServer: {
    enabled: false,
    url: '0.wled.pool.ntp.org',
  },
  use24HourFormat: true,
  timeZone: 0,
  utcOffsetSeconds: 0,
  coordinates: {
    longitude: 0.00,
    latitude: 0.00,
  },
  analogClockOverlay: {
    enabled: false,
    firstLed: 1,
    lastLed: 50,
    middleLed: 0,
    show5MinuteMarks: true,
    showSeconds: false,
    showSolidBlack: false,
  },
  countdown: {
    enabled: false,
    year: 2025,
    month: 4,
    day: 20,
    hour: 11,
    minute: 59,
    second: 30,
  },
  presets: {
    alexaOn: 1,
    alexaOff: 2,
    countdownEnd: 3,
    timerEnd: 4,
  },
  buttonActions: [
    // button action 0
    {
      index: 0,
      short: 1,
      long: 2,
      double: 3,
    },
    // button action 1
    {
      index: 1,
      short: 4,
      long: 5,
      double: 6,
    },
    // button action 2
    {
      index: 2,
      short: 7,
      long: 8,
      double: 9,
    },
    // button action 3
    {
      index: 3,
      short: 10,
      long: 11,
      double: 12,
    },
  ],
  scheduledPresets: [
    // scheduled preset 0
    {
      enabled: true,
      presetId: 10,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 11, 31),
      hour: 12,
      minute: 15,
      days: {
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false,
      },
    },
    // scheduled preset 1
    {
      enabled: true,
      presetId: 0,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 11, 31),
      hour: 0,
      minute: 0,
      days: {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: true,
      },
    },
    // scheduled preset 2
    {
      enabled: true,
      presetId: 0,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 11, 31),
      hour: 0,
      minute: 0,
      days: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: true,
        6: false,
      },
    },
    // scheduled preset 3
    {
      enabled: false,
      presetId: 0,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 11, 31),
      hour: 0,
      minute: 0,
      days: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
    },
    // scheduled preset 4
    {
      enabled: true,
      presetId: 0,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 11, 31),
      hour: 0,
      minute: 0,
      days: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
    },
    // scheduled preset 5
    {
      enabled: false,
      presetId: 0,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 11, 31),
      hour: 0,
      minute: 0,
      days: {
        0: false,
        1: true,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
    },
    // scheduled preset 6
    {
      enabled: true,
      presetId: 0,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 11, 31),
      hour: 0,
      minute: 0,
      days: {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
      },
    },
    // scheduled preset 7
    {
      enabled: false,
      presetId: 0,
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 11, 31),
      hour: 0,
      minute: 0,
      days: {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
      },
    },
  ],
  sunrisePreset: {
    enabled: true,
    presetId: 4,
    minute: 5,
    days: {
      0: true,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
    },
  },
  sunsetPreset: {
    enabled: true,
    presetId: 0,
    minute: -5,
    days: {
      0: true,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
    },
  },
};
