import { WLEDNodesResponse } from '../shared/api-types/api-nodes';
import { WLEDPalettesData } from '../shared/api-types/api-palettes';
import { WLEDPresets } from '../shared/api-types/api-presets';
import { WLEDApiResponse } from '../shared/api-types/api-types';
import { LiveViewData } from '../shared/live-view/live-view.service';

// TODO create 2 mock datas: 1 for new user (so the app can load), 1 for development (this current file)

export const MOCK_API_RESPONSE: WLEDApiResponse = {
  state: {
    on: true,
    bri: 128,
    transition: 5,
    ps: -1,
    pl: -1,
    nl: {
      on: false,
      dur: 60,
      mode: 1,
      tbri: 0,
      rem: -1,
    },
    udpn: {
      send: false,
      recv: true,
      sgrp: 1,
      rgrp: 1,
    },
    lor: 0,
    mainseg: 0,
    seg: [
      {
        id: 0,
        start: 0,
        stop: 268,
        startY: 0, // TODO
        stopY: 0, // TODO
        len: 268,
        grp: 1,
        spc: 0,
        of: 0,
        col: [
          [255, 10, 100, 128],
          [0, 0, 0],
          [0, 0, 0]
        ],
        fx: 0,
        sx: 128,
        ix: 128,
        c1: 0,
        c2: 0,
        c3: 0,
        o1: false,
        o2: false,
        o3: false,
        pal: 0,
        sel: true,
        rev: false,
        rY: false,
        on: true,
        bri: 255,
        mi: false,
        mY: false,
        tp: false,
        cct: 127,
        lx: 0,
        ly: 0,
        frz: false,
        m12: 0,
        si: 0,
        fxdef: false, // TODO
        set: 0, // TODO
        rpt: false,
        // n: 'stove',
      },
      {
        id: 1,
        start: 268,
        stop: 756,
        startY: 0, // TODO
        stopY: 0, // TODO
        len: 488,
        grp: 1,
        spc: 0,
        of: 0,
        col: [
          [102, 153, 0, 128],
          [0, 0, 0],
          [0, 0, 0]
        ],
        fx: 0,
        sx: 128,
        ix: 128,
        c1: 0,
        c2: 0,
        c3: 0,
        o1: false,
        o2: false,
        o3: false,
        pal: 0,
        sel: false,
        rev: false,
        rY: false,
        on: true,
        bri: 255,
        mi: false,
        mY: false,
        tp: false,
        cct: 127,
        lx: 0,
        ly: 0,
        frz: false,
        m12: 0,
        si: 0,
        fxdef: false, // TODO
        set: 0, // TODO
        rpt: false,
        // n: 'sink',
      },
      {
        id: 2,
        start: 756,
        stop: 1062,
        startY: 0, // TODO
        stopY: 0, // TODO
        len: 306,
        grp: 1,
        spc: 0,
        of: 0,
        col: [
          [0, 204, 51, 128],
          [0, 0, 0],
          [0, 0, 0]
        ],
        fx: 0,
        sx: 128,
        ix: 128,
        c1: 0,
        c2: 0,
        c3: 0,
        o1: false,
        o2: false,
        o3: false,
        pal: 0,
        sel: false,
        rev: false,
        rY: false,
        on: true,
        bri: 255,
        mi: false,
        mY: false,
        tp: false,
        cct: 127,
        lx: 0,
        ly: 0,
        frz: false,
        m12: 0,
        si: 0,
        fxdef: false, // TODO
        set: 0, // TODO
        rpt: false,
        // n: 'window',
      },
      {
        id: 3,
        start: 1062,
        stop: 1429,
        startY: 0, // TODO
        stopY: 0, // TODO
        len: 367,
        grp: 1,
        spc: 0,
        of: 0,
        col: [
          [0, 51, 204, 128],
          [0, 0, 0],
          [0, 0, 0]
        ],
        fx: 0,
        sx: 128,
        ix: 128,
        c1: 0,
        c2: 0,
        c3: 0,
        o1: false,
        o2: false,
        o3: false,
        pal: 0,
        sel: false,
        rev: false,
        rY: false,
        on: true,
        bri: 255,
        mi: false,
        mY: false,
        tp: false,
        cct: 127,
        lx: 0,
        ly: 0,
        frz: false,
        m12: 0,
        si: 0,
        fxdef: false, // TODO
        set: 0, // TODO
        rpt: false,
        // n: 'couch',
      },
    ],
  },
  info: {
    ver: '0.13.0-b6',
    vid: 2112080,
    leds: {
      count: 1429,
      fps: 33,
      pwr: 3556,
      maxpwr: 8574,
      maxseg: 32,
      lc: 0,
      seglc: [0, 0, 0, 0],
    },
    str: false,
    name: 'WLED',
    udpport: 21324,
    live: false,
    lm: '',
    lip: '',
    ws: 0,
    fxcount: 118,
    palcount: 71,
    wifi: {
      bssid: '74:83:C2:7E:D4:30',
      rssi: -56,
      signal: 88,
      channel: 1,
    },
    fs: {
      u: 12,
      t: 61,
      pmt: 1643131723,
    },
    ndc: 0,
    arch: 'esp32',
    core: 'v3.2.3-14-gd3e562907',
    // lwip: 0,
    freeheap: 173464,
    uptime: 295426,
    opt: 127,
    brand: 'WLED',
    product: 'FOSS',
    mac: 'e0e2e655a9b0',
    ip: '192.168.100.154',
  },
  effects: [
    'Solid',
    'Blink',
    'Breathe',
    'Wipe',
    'Wipe Random',
    'Random Colors',
    'Sweep',
    'Dynamic',
    'Colorloop',
    'Rainbow',
    'Scan',
    'Scan Dual',
    'Fade',
    'Theater',
    'Theater Rainbow',
    'Running',
    'Saw',
    'Twinkle',
    'Dissolve',
    'Dissolve Rnd',
    'Sparkle',
    'Sparkle Dark',
    'Sparkle+',
    'Strobe',
    'Strobe Rainbow',
    'Strobe Mega',
    'Blink Rainbow',
    'Android',
    'Chase',
    'Chase Random',
    'Chase Rainbow',
    'Chase Flash',
    'Chase Flash Rnd',
    'Rainbow Runner',
    'Colorful',
    'Traffic Light',
    'Sweep Random',
    'Chase 2',
    'Aurora',
    'Stream',
    'Scanner',
    'Lighthouse',
    'Fireworks',
    'Rain',
    'Tetrix',
    'Fire Flicker',
    'Gradient',
    'Loading',
    'Rolling Balls',
    'Fairy',
    'Two Dots',
    'Fairytwinkle',
    'Running Dual',
    'RSVD',
    'Chase 3',
    'Tri Wipe',
    'Tri Fade',
    'Lightning',
    'ICU',
    'Multi Comet',
    'Scanner Dual',
    'Stream 2',
    'Oscillate',
    'Pride 2015',
    'Juggle',
    'Palette',
    'Fire 2012',
    'Colorwaves',
    'Bpm',
    'Fill Noise',
    'Noise 1',
    'Noise 2',
    'Noise 3',
    'Noise 4',
    'Colortwinkles',
    'Lake',
    'Meteor',
    'Meteor Smooth',
    'Railway',
    'Ripple',
    'Twinklefox',
    'Twinklecat',
    'Halloween Eyes',
    'Solid Pattern',
    'Solid Pattern Tri',
    'Spots',
    'Spots Fade',
    'Glitter',
    'Candle',
    'Fireworks Starburst',
    'Fireworks 1D',
    'Bouncing Balls',
    'Sinelon',
    'Sinelon Dual',
    'Sinelon Rainbow',
    'Popcorn',
    'Drip',
    'Plasma',
    'Percent',
    'Ripple Rainbow',
    'Heartbeat',
    'Pacifica',
    'Candle Multi',
    'Solid Glitter',
    'Sunrise',
    'Phased',
    'Twinkleup',
    'Noise Pal',
    'Sine',
    'Phased Noise',
    'Flow',
    'Chunchun',
    'Dancing Shadows',
    'Washing Machine',
    'RSVD',
    'Blends',
    'TV Simulator',
    'Dynamic Smooth',
    'Spaceships',
    'Crazy Bees',
    'Ghost Rider',
    'Blobs',
    'Scrolling Text',
    'Drift Rose',
    'Distortion Waves',
    'Soap',
    'Octopus',
    'Waving Cell',
    'Pixels',
    'Pixelwave',
    'Juggles',
    'Matripix',
    'Gravimeter',
    'Plasmoid',
    'Puddles',
    'Midnoise',
    'Noisemeter',
    'Freqwave',
    'Freqmatrix',
    'GEQ',
    'Waterfall',
    'Freqpixels',
    'RSVD',
    'Noisefire',
    'Puddlepeak',
    'Noisemove',
    'Noise2D',
    'Perlin Move',
    'Ripple Peak',
    'Firenoise',
    'Squared Swirl',
    'RSVD',
    'DNA',
    'Matrix',
    'Metaballs',
    'Freqmap',
    'Gravcenter',
    'Gravcentric',
    'Gravfreq',
    'DJ Light',
    'Funky Plank',
    'RSVD',
    'Pulser',
    'Blurz',
    'Drift',
    'Waverly',
    'Sun Radiation',
    'Colored Bursts',
    'Julia',
    'RSVD',
    'RSVD',
    'RSVD',
    'Game Of Life',
    'Tartan',
    'Polar Lights',
    'Swirl',
    'Lissajous',
    'Frizzles',
    'Plasma Ball',
    'Flow Stripe',
    'Hiphotic',
    'Sindots',
    'DNA Spiral',
    'Black Hole',
    'Wavesins',
    'Rocktaves',
    'Akemi',
  ],
  palettes: [
    'Default',
    '* Random Cycle',
    '* Color 1',
    '* Colors 1&2',
    '* Color Gradient',
    '* Colors Only',
    'Party',
    'Cloud',
    'Lava',
    'Ocean',
    'Forest',
    'Rainbow',
    'Rainbow Bands',
    'Sunset',
    'Rivendell',
    'Breeze',
    'Red & Blue',
    'Yellowout',
    'Analogous',
    'Splash',
    'Pastel',
    'Sunset 2',
    'Beach',
    'Vintage',
    'Departure',
    'Landscape',
    'Beech',
    'Sherbet',
    'Hult',
    'Hult 64',
    'Drywet',
    'Jul',
    'Grintage',
    'Rewhi',
    'Tertiary',
    'Fire',
    'Icefire',
    'Cyane',
    'Light Pink',
    'Autumn',
    'Magenta',
    'Magred',
    'Yelmag',
    'Yelblu',
    'Orange & Teal',
    'Tiamat',
    'April Night',
    'Orangery',
    'C9',
    'Sakura',
    'Aurora',
    'Atlantica',
    'C9 2',
    'C9 New',
    'Temperature',
    'Aurora 2',
    'Retro Clown',
    'Candy',
    'Toxy Reaf',
    'Fairy Reaf',
    'Semi Blue',
    'Pink Candy',
    'Red Reaf',
    'Aqua Flash',
    'Yelblu Hot',
    'Lite Light',
    'Red Flash',
    'Blink Red',
    'Red Shift',
    'Red Tide',
    'Candy2',
  ],
};

export const MOCK_NODES_RESPONSE: WLEDNodesResponse = {
  nodes: [
    {
      name: 'test 1',
      ip: '1.1.1.1',
      type: 32,
      vid: '0.13.6',
    },
    {
      name: 'test 2',
      ip: '2.2.2.2',
      type: 33,
      vid: '0.13.6',
    },
    {
      name: 'WLED',
      ip: '3.3.3.3',
      type: 82,
      vid: '0',
    },
  ],
};

export const MOCK_EFFECTS_DATA_RESPONSE: string[] = [
  '',
  '!,Duty cycle;!,!;!;01',
  '!;!,!;!;01',
  '!,!;!,!;!',
  '!;;!',
  '!,Fade time;;!;01',
  '!,!;!,!;!',
  '!,!,,,,Smooth;;!',
  '!,Saturation;;!;01',
  '!,Size;;!',
  '!,# of dots,,,,,Overlay;!,!,!;!',
  '!,# of dots,,,,,Overlay;!,!,!;!',
  '!;!,!;!;01',
  '!,Gap size;!,!;!',
  '!,Gap size;,!;!',
  '!,Wave width;!,!;!',
  '!,Width;!,!;!',
  '!,!;!,!;!;;m12=0',
  'Repeat speed,Dissolve speed,,,,Random;!,!;!',
  'Repeat speed,Dissolve speed;,!;!',
  '!,,,,,,Overlay;!,!;!;;m12=0',
  '!,!,,,,,Overlay;Bg,Fx;!;;m12=0',
  '!,!,,,,,Overlay;Bg,Fx;!;;m12=0',
  '!;!,!;!;01',
  '!;,!;!;01',
  '!,!;!,!;!;01',
  'Frequency,Blink duration;!,!;!;01',
  '!,Width;!,!;!;;m12=1',
  '!,Width;!,!,!;!',
  '!,Width;!,,!;!',
  '!,Width;!,!;!',
  '!;Bg,Fx;!',
  '!;!,!;!',
  '!,Size;Bg;!',
  '!,Saturation;1,2,3;!',
  '!,US style;,!;!',
  '!;;!',
  '!,Width;!,!;!',
  '!,!;1,2,3;!;;sx=24,pal=50',
  '!,Zone size;;!',
  '!,Fade rate;!,!;!;;m12=0',
  '!,Fade rate;!,!;!',
  ',Frequency;!,!;!;12;ix=192,pal=11',
  '!,Spawning rate;!,!;!;12;ix=128,pal=0',
  '!,Width,,,,One color;!,!;!;;sx=0,ix=0,pal=11,m12=1',
  '!,!;!;!;01',
  '!,Spread;!,!;!;;ix=16',
  '!,Fade;!,!;!;;ix=16',
  '!,# of balls,,,,Collisions,Overlay,Trails;!,!,!;!;1;m12=1',
  '!,# of flashers;!,!;!',
  '!,Dot size,,,,,Overlay;1,2,Bg;!',
  '!,!;!,!;!;;m12=0',
  '!,Wave width;L,!,R;!',
  '',
  '!,Size;1,2,3;!',
  '!;1,2,3;!',
  '!;1,2,3;!',
  '!,!,,,,,Overlay;!,!;!',
  '!,!,,,,,Overlay;!,!;!',
  '',
  '!,Fade rate;!,!,!;!;;m12=0',
  '!;;',
  '',
  '!;;',
  '!,Trail;;!;;sx=64,ix=128',
  'Cycle speed;;!;;c3=0,o2=0',
  'Cooling,Spark rate,,,Boost;;!;1;sx=64,ix=160,m12=1',
  '!,Hue;!;!',
  '!;!;!;;sx=64',
  '!;!;!',
  '!;!;!',
  '!;!;!',
  '!;!;!',
  '!;!;!',
  'Fade speed,Spawn speed;;!;;m12=0',
  '!;Fx;!',
  '!,Trail,,,,Gradient;;!;1',
  '!,Trail,,,,Gradient;;!;1',
  '!,Smoothness;1,2;!',
  '!,Wave #,,,,,Overlay;,!;!;12',
  '!,Twinkle rate,,,,Cool;;!',
  '!,Twinkle rate,,,,Cool;;!',
  'Duration,Eye fade time,,,,,Overlay;!,!;!;12',
  'Fg size,Bg size;Fg,!;!;;pal=0',
  ',Size;1,2,3;;;pal=0',
  'Spread,Width,,,,,Overlay;!,!;!',
  'Spread,Width,,,,,Overlay;!,!;!',
  '!,!,,,,,Overlay;1,2,Glitter color;!;;pal=0,m12=0',
  '!,!;!,!;!;01;sx=96,ix=224,pal=0',
  'Chance,Fragments,,,,,Overlay;,!;!;;pal=11,m12=0',
  'Gravity,Firing side;!,!;!;12;pal=11,ix=128',
  'Gravity,# of balls,,,,,Overlay;!,!,!;!;1;m12=1',
  '!,Trail;!,!,!;!',
  '!,Trail;!,!,!;!',
  '!,Trail;,,!;!',
  '!,!,,,,,Overlay;!,!,!;!;;m12=1',
  'Gravity,# of drips,,,,,Overlay;!,!;!;;m12=1',
  'Phase,!;!;!',
  ',% of fill,,,,One color;!,!;!',
  '!,Wave #;;!;12',
  '!,!;!,!;!;01;m12=1',
  '!,Angle;;!;;pal=51',
  '!,!;!,!;!;;sx=96,ix=224,pal=0',
  ',!;Bg,,Glitter color;;;m12=0',
  'Time [min],Width;;!;;sx=60',
  '!,!;!,!;!',
  '!,Intensity;!,!;!;;m12=0',
  '!,Scale;;!',
  '',
  '!,!;!,!;!',
  '!,Zones;;!;;m12=1',
  '!,Gap size;!,!;!',
  '!,# of shadows;!;!',
  '!,!;;!',
  '',
  'Shift speed,Blend speed;;!',
  '!,!;;',
  '!,!;;!',
  '!,Blur;;!;2',
  '!,Blur;;;2',
  'Fade rate,Blur;;!;2',
  '!,# blobs,Blur,Trail;!;!;2;c1=8',
  '!,Y Offset,Trail,Font size,Rotate,Gradient,Overlay,Reverse;!,!,Gradient;!;2;ix=128,c1=0,rev=0,mi=0,rY=0,mY=0',
  'Fade,Blur;;;2',
  '!,Scale;;;2',
  '!,Smoothness;;!;2',
  '!,,Offset X,Offset Y,Legs;;!;2;',
  '!,,Amplitude 1,Amplitude 2,Amplitude 3;;!;2',
  'Fade rate,# of pixels;!,!;!;1v;m12=0,si=0',
  '!,Sensitivity;!,!;!;1v;ix=64,m12=2,si=0',
  '!,# of balls;!,!;!;1v;m12=0,si=0',
  '!,Brightness;!,!;!;1v;ix=64,m12=2,si=1',
  'Rate of fall,Sensitivity;!,!;!;1v;ix=128,m12=2,si=0',
  'Phase,# of pixels;!,!;!;1v;sx=128,ix=128,m12=0,si=0',
  'Fade rate,Puddle size;!,!;!;1v;m12=0,si=0',
  'Fade rate,Max. length;!,!;!;1v;ix=128,m12=1,si=0',
  'Fade rate,Width;!,!;!;1v;ix=128,m12=2,si=0',
  'Speed,Sound effect,Low bin,High bin,Pre-amp;;;1f;m12=2,si=0',
  'Speed,Sound effect,Low bin,High bin,Sensivity;;;1f;m12=3,si=0',
  'Fade speed,Ripple decay,# of bands,,,Color bars;!,,Peaks;!;2f;c1=255,c2=64,pal=11,si=0',
  '!,Adjust color,Select bin,Volume (min);!,!;!;1f;c2=0,m12=2,si=0',
  'Fade rate,Starting color and # of pixels;!,!,;!;1f;m12=0,si=0',
  '',
  '!,!;;;1v;m12=2,si=0',
  'Fade rate,Puddle size,Select bin,Volume (min);!,!;!;1v;c2=0,m12=0,si=0',
  'Speed of perlin movement,Fade rate;!,!;!;1f;m12=0,si=0',
  '!,Scale;;!;2',
  '!,# of pixels,Fade rate;!,!;!',
  'Fade rate,Max # of ripples,Select bin,Volume (min);!,!;!;1v;c2=0,m12=0,si=0',
  'X scale,Y scale;;!;2',
  ',,,,Blur;;!;2',
  '',
  'Scroll speed,Blur;;!;2',
  '!,Spawning rate,Trail,,,Custom color;Spawn,Trail;;2',
  '!;;!;2',
  'Fade rate,Starting color;!,!;!;1f;m12=0,si=0',
  'Rate of fall,Sensitivity;!,!;!;1v;ix=128,m12=2,si=0',
  'Rate of fall,Sensitivity;!,!;!;1v;ix=128,m12=3,si=0',
  'Rate of fall,Sensivity;!,!;!;1f;ix=128,m12=0,si=0',
  'Speed;;;1f;m12=2,si=0',
  'Scroll speed,,# of bands;;;2f;si=0',
  '',
  '!,Blur;;!;2',
  'Fade rate,Blur;!,Color mix;!;1f;m12=0,si=0',
  'Rotation speed,Blur amount;;!;2',
  'Amplification,Sensitivity;;!;2v;ix=64,si=0',
  'Variance,Brightness;;;2',
  'Speed,# of lines,,,Blur,Gradient,,Dots;;!;2;c3=16',
  ',Max iterations per pixel,X center,Y center,Area size;!;!;2;ix=24,c1=128,c2=128,c3=16',
  '',
  '',
  '',
  '!;!,!;!;2',
  'X scale,Y scale,,,Sharpness;;!;2',
  '!,Scale;;;2',
  '!,Sensitivity,Blur;,Bg Swirl;!;2v;ix=64,si=0',
  'X frequency,Fade rate,,,Speed;!;!;2;;c3=15',
  'X frequency,Y frequency,Blur;;!;2',
  'Speed,,Fade,Blur;;!;2',
  'Hue speed,Effect speed;;',
  'X scale,Y scale,,,Speed;!;!;2',
  '!,Dot distance,Fade rate,Blur;;!;2',
  'Scroll speed,Y frequency;;!;2',
  'Fade rate,Outer Y freq.,Outer X freq.,Inner X freq.,Inner Y freq.,Solid;!;!;2;pal=11',
  '!,Brightness variation,Starting color,Range of colors,Color variation;!;!',
  ';!,!;!;1f;m12=1,si=0',
  'Color speed,Dance;Head palette,Arms & Legs,Eyes & Mouth;Face palette;2f;si=0',
];

export const MOCK_PALETTES_DATA: WLEDPalettesData[] = [{
  m: 8,
  p: {
    0: [[0, 85, 0, 171], [15.9375, 132, 0, 124], [31.875, 181, 0, 75], [47.8125, 229, 0, 27], [63.75, 232, 23, 0], [79.6875, 184, 71, 0], [95.625, 171, 119, 0], [111.5625, 171, 171, 0], [127.5, 171, 85, 0], [143.4375, 221, 34, 0], [159.375, 242, 0, 14], [175.3125, 194, 0, 62], [191.25, 143, 0, 113], [207.1875, 95, 0, 161], [223.125, 47, 0, 208], [239.0625, 0, 7, 249]],
    1: ['r', 'r', 'r', 'r'],
    2: ['c1'],
    3: ['c1', 'c1', 'c2', 'c2'],
    4: ['c3', 'c2', 'c1'],
    5: ['c1', 'c1', 'c1', 'c1', 'c1', 'c2', 'c2', 'c2', 'c2', 'c2', 'c3', 'c3', 'c3', 'c3', 'c3', 'c1'],
    6: [[0, 85, 0, 171], [15.9375, 132, 0, 124], [31.875, 181, 0, 75], [47.8125, 229, 0, 27], [63.75, 232, 23, 0], [79.6875, 184, 71, 0], [95.625, 171, 119, 0], [111.5625, 171, 171, 0], [127.5, 171, 85, 0], [143.4375, 221, 34, 0], [159.375, 242, 0, 14], [175.3125, 194, 0, 62], [191.25, 143, 0, 113], [207.1875, 95, 0, 161], [223.125, 47, 0, 208], [239.0625, 0, 7, 249]],
    7: [[0, 0, 0, 255], [15.9375, 0, 0, 139], [31.875, 0, 0, 139], [47.8125, 0, 0, 139], [63.75, 0, 0, 139], [79.6875, 0, 0, 139], [95.625, 0, 0, 139], [111.5625, 0, 0, 139], [127.5, 0, 0, 255], [143.4375, 0, 0, 139], [159.375, 135, 206, 235], [175.3125, 135, 206, 235], [191.25, 173, 216, 230], [207.1875, 255, 255, 255], [223.125, 173, 216, 230], [239.0625, 135, 206, 235]],
  },
},
{
  m: 8,
  p: {
    8: [[0, 0, 0, 0], [15.9375, 128, 0, 0], [31.875, 0, 0, 0], [47.8125, 128, 0, 0], [63.75, 139, 0, 0], [79.6875, 128, 0, 0], [95.625, 139, 0, 0], [111.5625, 139, 0, 0], [127.5, 139, 0, 0], [143.4375, 255, 0, 0], [159.375, 255, 165, 0], [175.3125, 255, 255, 255], [191.25, 255, 165, 0], [207.1875, 255, 0, 0], [223.125, 139, 0, 0], [239.0625, 0, 0, 0]],
    9: [[0, 25, 25, 112], [15.9375, 0, 0, 139], [31.875, 25, 25, 112], [47.8125, 0, 0, 128], [63.75, 0, 0, 139], [79.6875, 0, 0, 205], [95.625, 46, 139, 87], [111.5625, 0, 128, 128], [127.5, 95, 158, 160], [143.4375, 0, 0, 255], [159.375, 0, 139, 139], [175.3125, 100, 149, 237], [191.25, 127, 255, 212], [207.1875, 46, 139, 87], [223.125, 0, 255, 255], [239.0625, 135, 206, 250]],
    10: [[0, 0, 100, 0], [15.9375, 0, 100, 0], [31.875, 85, 107, 47], [47.8125, 0, 100, 0], [63.75, 0, 128, 0], [79.6875, 34, 139, 34], [95.625, 107, 142, 35], [111.5625, 0, 128, 0], [127.5, 46, 139, 87], [143.4375, 102, 205, 170], [159.375, 50, 205, 50], [175.3125, 154, 205, 50], [191.25, 144, 238, 144], [207.1875, 124, 252, 0], [223.125, 102, 205, 170], [239.0625, 34, 139, 34]],
    11: [[0, 255, 0, 0], [15.9375, 213, 42, 0], [31.875, 171, 85, 0], [47.8125, 171, 127, 0], [63.75, 171, 171, 0], [79.6875, 86, 213, 0], [95.625, 0, 255, 0], [111.5625, 0, 213, 42], [127.5, 0, 171, 85], [143.4375, 0, 86, 170], [159.375, 0, 0, 255], [175.3125, 42, 0, 213], [191.25, 85, 0, 171], [207.1875, 127, 0, 129], [223.125, 171, 0, 85], [239.0625, 213, 0, 43]],
    12: [[0, 255, 0, 0], [15.9375, 0, 0, 0], [31.875, 171, 85, 0], [47.8125, 0, 0, 0], [63.75, 171, 171, 0], [79.6875, 0, 0, 0], [95.625, 0, 255, 0], [111.5625, 0, 0, 0], [127.5, 0, 171, 85], [143.4375, 0, 0, 0], [159.375, 0, 0, 255], [175.3125, 0, 0, 0], [191.25, 85, 0, 171], [207.1875, 0, 0, 0], [223.125, 171, 0, 85], [239.0625, 0, 0, 0]],
    13: [[0, 120, 0, 0], [22, 179, 22, 0], [51, 255, 104, 0], [85, 167, 22, 18], [135, 100, 0, 103], [198, 16, 0, 130], [255, 0, 0, 160]],
    14: [[0, 1, 14, 5], [101, 16, 36, 14], [165, 56, 68, 30], [242, 150, 156, 99], [255, 150, 156, 99]],
    15: [[0, 1, 6, 7], [89, 1, 99, 111], [153, 144, 209, 255], [255, 0, 73, 82]],
  },
},
{
  m: 8,
  p: {
    16: [[0, 4, 1, 70], [31, 55, 1, 30], [63, 255, 4, 7], [95, 59, 2, 29], [127, 11, 3, 50], [159, 39, 8, 60], [191, 112, 19, 40], [223, 78, 11, 39], [255, 29, 8, 59]],
    17: [[0, 188, 135, 1], [255, 46, 7, 1]],
    18: [[0, 3, 0, 255], [63, 23, 0, 255], [127, 67, 0, 255], [191, 142, 0, 45], [255, 255, 0, 0]],
    19: [[0, 126, 11, 255], [127, 197, 1, 22], [175, 210, 157, 172], [221, 157, 3, 112], [255, 157, 3, 112]],
    20: [[0, 10, 62, 123], [36, 56, 130, 103], [87, 153, 225, 85], [100, 199, 217, 68], [107, 255, 207, 54], [115, 247, 152, 57], [120, 239, 107, 61], [128, 247, 152, 57], [180, 255, 207, 54], [223, 255, 227, 48], [255, 255, 248, 42]],
    21: [[0, 110, 49, 11], [29, 55, 34, 10], [68, 22, 22, 9], [68, 239, 124, 8], [97, 220, 156, 27], [124, 203, 193, 61], [178, 33, 53, 56], [255, 0, 1, 52]],
    22: [[0, 255, 252, 214], [12, 255, 252, 214], [22, 255, 252, 214], [26, 190, 191, 115], [28, 137, 141, 52], [28, 112, 255, 205], [50, 51, 246, 214], [71, 17, 235, 226], [93, 2, 193, 199], [120, 0, 156, 174], [133, 1, 101, 115], [136, 1, 59, 71], [136, 7, 131, 170], [208, 1, 90, 151], [255, 0, 56, 133]],
    23: [[0, 4, 1, 1], [51, 16, 0, 1], [76, 97, 104, 3], [101, 255, 131, 19], [127, 67, 9, 4], [153, 16, 0, 1], [229, 4, 1, 1], [255, 4, 1, 1]],
  },
},
{
  m: 8,
  p: {
    24: [[0, 8, 3, 0], [42, 23, 7, 0], [63, 75, 38, 6], [84, 169, 99, 38], [106, 213, 169, 119], [116, 255, 255, 255], [138, 135, 255, 138], [148, 22, 255, 24], [170, 0, 255, 0], [191, 0, 136, 0], [212, 0, 55, 0], [255, 0, 55, 0]],
    25: [[0, 0, 0, 0], [37, 2, 25, 1], [76, 15, 115, 5], [127, 79, 213, 1], [128, 126, 211, 47], [130, 188, 209, 247], [153, 144, 182, 205], [204, 59, 117, 250], [255, 1, 37, 192]],
    26: [[0, 1, 5, 0], [19, 32, 23, 1], [38, 161, 55, 1], [63, 229, 144, 1], [66, 39, 142, 74], [255, 1, 4, 1]],
    27: [[0, 255, 33, 4], [43, 255, 68, 25], [86, 255, 7, 25], [127, 255, 82, 103], [170, 255, 255, 242], [209, 42, 255, 22], [255, 87, 255, 65]],
    28: [[0, 247, 176, 247], [48, 255, 136, 255], [89, 220, 29, 226], [160, 7, 82, 178], [216, 1, 124, 109], [255, 1, 124, 109]],
    29: [[0, 1, 124, 109], [66, 1, 93, 79], [104, 52, 65, 1], [130, 115, 127, 1], [150, 52, 65, 1], [201, 1, 86, 72], [239, 0, 55, 45], [255, 0, 55, 45]],
    30: [[0, 47, 30, 2], [42, 213, 147, 24], [84, 103, 219, 52], [127, 3, 219, 207], [170, 1, 48, 214], [212, 1, 1, 111], [255, 1, 7, 33]],
    31: [[0, 194, 1, 1], [94, 1, 29, 18], [132, 57, 131, 28], [255, 113, 1, 1]],
  },
},
{
  m: 8,
  p: {
    32: [[0, 2, 1, 1], [53, 18, 1, 0], [104, 69, 29, 1], [153, 167, 135, 10], [255, 46, 56, 4]],
    33: [[0, 113, 91, 147], [72, 157, 88, 78], [89, 208, 85, 33], [107, 255, 29, 11], [141, 137, 31, 39], [255, 59, 33, 89]],
    34: [[0, 0, 1, 255], [63, 3, 68, 45], [127, 23, 255, 0], [191, 100, 68, 1], [255, 255, 1, 4]],
    35: [[0, 0, 0, 0], [46, 18, 0, 0], [96, 113, 0, 0], [108, 142, 3, 1], [119, 175, 17, 1], [146, 213, 44, 2], [174, 255, 82, 4], [188, 255, 115, 4], [202, 255, 156, 4], [218, 255, 203, 4], [234, 255, 255, 4], [244, 255, 255, 71], [255, 255, 255, 255]],
    36: [[0, 0, 0, 0], [59, 0, 9, 45], [119, 0, 38, 255], [149, 3, 100, 255], [180, 23, 199, 255], [217, 100, 235, 255], [255, 255, 255, 255]],
    37: [[0, 10, 85, 5], [25, 29, 109, 18], [60, 59, 138, 42], [93, 83, 99, 52], [106, 110, 66, 64], [109, 123, 49, 65], [113, 139, 35, 66], [116, 192, 117, 98], [124, 255, 255, 137], [168, 100, 180, 155], [255, 22, 121, 174]],
    38: [[0, 19, 2, 39], [25, 26, 4, 45], [51, 33, 6, 52], [76, 68, 62, 125], [102, 118, 187, 240], [109, 163, 215, 247], [114, 217, 244, 255], [122, 159, 149, 221], [149, 113, 78, 188], [183, 128, 57, 155], [255, 146, 40, 123]],
    39: [[0, 26, 1, 1], [51, 67, 4, 1], [84, 118, 14, 1], [104, 137, 152, 52], [112, 113, 65, 1], [122, 133, 149, 59], [124, 137, 152, 52], [135, 113, 65, 1], [142, 139, 154, 46], [163, 113, 13, 1], [204, 55, 3, 1], [249, 17, 1, 1], [255, 17, 1, 1]],
  },
},
{
  m: 8,
  p: {
    40: [[0, 0, 0, 0], [42, 0, 0, 45], [84, 0, 0, 255], [127, 42, 0, 255], [170, 255, 0, 255], [212, 255, 55, 255], [255, 255, 255, 255]],
    41: [[0, 0, 0, 0], [63, 42, 0, 45], [127, 255, 0, 255], [191, 255, 0, 45], [255, 255, 0, 0]],
    42: [[0, 0, 0, 0], [42, 42, 0, 0], [84, 255, 0, 0], [127, 255, 0, 45], [170, 255, 0, 255], [212, 255, 55, 45], [255, 255, 255, 0]],
    43: [[0, 0, 0, 255], [63, 0, 55, 255], [127, 0, 255, 255], [191, 42, 255, 45], [255, 255, 255, 0]],
    44: [[0, 0, 150, 92], [55, 0, 150, 92], [200, 255, 72, 0], [255, 255, 72, 0]],
    45: [[0, 1, 2, 14], [33, 2, 5, 35], [100, 13, 135, 92], [120, 43, 255, 193], [140, 247, 7, 249], [160, 193, 17, 208], [180, 39, 255, 154], [200, 4, 213, 236], [220, 39, 252, 135], [240, 193, 213, 253], [255, 255, 249, 255]],
    46: [[0, 1, 5, 45], [10, 1, 5, 45], [25, 5, 169, 175], [40, 1, 5, 45], [61, 1, 5, 45], [76, 45, 175, 31], [91, 1, 5, 45], [112, 1, 5, 45], [127, 249, 150, 5], [143, 1, 5, 45], [162, 1, 5, 45], [178, 255, 92, 0], [193, 1, 5, 45], [214, 1, 5, 45], [229, 223, 45, 72], [244, 1, 5, 45], [255, 1, 5, 45]],
    47: [[0, 255, 95, 23], [30, 255, 82, 0], [60, 223, 13, 8], [90, 144, 44, 2], [120, 255, 110, 17], [150, 255, 69, 0], [180, 158, 13, 11], [210, 241, 82, 17], [255, 213, 37, 4]],
  },
},
{
  m: 8,
  p: {
    48: [[0, 184, 4, 0], [60, 184, 4, 0], [65, 144, 44, 2], [125, 144, 44, 2], [130, 4, 96, 2], [190, 4, 96, 2], [195, 7, 7, 88], [255, 7, 7, 88]],
    49: [[0, 196, 19, 10], [65, 255, 69, 45], [130, 223, 45, 72], [195, 255, 82, 103], [255, 223, 13, 17]],
    50: [[0, 1, 5, 45], [64, 0, 200, 23], [128, 0, 255, 0], [170, 0, 243, 45], [200, 0, 135, 7], [255, 1, 5, 45]],
    51: [[0, 0, 28, 112], [50, 32, 96, 255], [100, 0, 243, 45], [150, 12, 95, 82], [200, 25, 190, 95], [255, 40, 170, 80]],
    52: [[0, 6, 126, 2], [45, 6, 126, 2], [45, 4, 30, 114], [90, 4, 30, 114], [90, 255, 5, 0], [135, 255, 5, 0], [135, 196, 57, 2], [180, 196, 57, 2], [180, 137, 85, 2], [255, 137, 85, 2]],
    53: [[0, 255, 5, 0], [60, 255, 5, 0], [60, 196, 57, 2], [120, 196, 57, 2], [120, 6, 126, 2], [180, 6, 126, 2], [180, 4, 30, 114], [255, 4, 30, 114]],
    54: [[0, 1, 27, 105], [14, 1, 40, 127], [28, 1, 70, 168], [42, 1, 92, 197], [56, 1, 119, 221], [70, 3, 130, 151], [84, 23, 156, 149], [99, 67, 182, 112], [113, 121, 201, 52], [127, 142, 203, 11], [141, 224, 223, 1], [155, 252, 187, 2], [170, 247, 147, 1], [184, 237, 87, 1], [198, 229, 43, 1], [226, 171, 2, 2], [240, 80, 3, 3], [255, 80, 3, 3]],
    55: [[0, 17, 177, 13], [64, 121, 242, 5], [128, 25, 173, 121], [192, 250, 77, 127], [255, 171, 101, 221]],
  },
},
{
  m: 8,
  p: {
    56: [[0, 227, 101, 3], [117, 194, 18, 19], [255, 92, 8, 192]],
    57: [[0, 229, 227, 1], [15, 227, 101, 3], [142, 40, 1, 80], [198, 17, 1, 79], [255, 0, 0, 45]],
    58: [[0, 1, 221, 53], [255, 73, 3, 178]],
    59: [[0, 184, 1, 128], [160, 1, 193, 182], [219, 153, 227, 190], [255, 255, 255, 255]],
    60: [[0, 0, 0, 0], [12, 1, 1, 3], [53, 8, 1, 22], [80, 4, 6, 89], [119, 2, 25, 216], [145, 7, 10, 99], [186, 15, 2, 31], [233, 2, 1, 5], [255, 0, 0, 0]],
    61: [[0, 255, 255, 255], [45, 7, 12, 255], [112, 227, 1, 127], [112, 227, 1, 127], [140, 255, 255, 255], [155, 227, 1, 127], [196, 45, 1, 99], [255, 255, 255, 255]],
    62: [[0, 3, 13, 43], [104, 78, 141, 240], [188, 255, 0, 0], [255, 28, 1, 1]],
    63: [[0, 0, 0, 0], [66, 57, 227, 233], [96, 255, 255, 8], [124, 255, 255, 255], [153, 255, 255, 8], [188, 57, 227, 233], [255, 0, 0, 0]],
  },
},
{
  m: 8,
  p: {
    64: [[0, 4, 2, 9], [58, 16, 0, 47], [122, 24, 0, 16], [158, 144, 9, 1], [183, 179, 45, 1], [219, 220, 114, 2], [255, 234, 237, 1]],
    65: [[0, 0, 0, 0], [9, 1, 1, 1], [40, 5, 5, 6], [66, 5, 5, 6], [101, 10, 1, 12], [255, 0, 0, 0]],
    66: [[0, 0, 0, 0], [99, 227, 1, 1], [130, 249, 199, 95], [155, 227, 1, 1], [255, 0, 0, 0]],
    67: [[0, 1, 1, 1], [43, 4, 1, 11], [76, 10, 1, 3], [109, 161, 4, 29], [127, 255, 86, 123], [165, 125, 16, 160], [204, 35, 13, 223], [255, 18, 2, 18]],
    68: [[0, 31, 1, 27], [45, 34, 1, 16], [99, 137, 5, 9], [132, 213, 128, 10], [175, 199, 22, 1], [201, 199, 9, 6], [255, 1, 0, 1]],
    69: [[0, 247, 5, 0], [28, 255, 67, 1], [43, 234, 88, 11], [58, 234, 176, 51], [84, 229, 28, 1], [114, 113, 12, 1], [140, 255, 225, 44], [168, 113, 12, 1], [196, 244, 209, 88], [216, 255, 28, 1], [255, 53, 1, 1]],
    70: [[0, 39, 33, 34], [25, 4, 6, 15], [48, 49, 29, 22], [73, 224, 173, 1], [89, 177, 35, 5], [130, 4, 6, 15], [163, 255, 114, 6], [186, 224, 173, 1], [211, 39, 33, 34], [255, 1, 1, 1]],
  },
}];

export const ALL_PALETTES_DATA = MOCK_PALETTES_DATA.reduce((prev, curr) => {
  const {
    m,
    p,
  } = curr;
  return {
    m: prev.m + m,
    p: {
      ...prev.p,
      ...p,
    }
  }
}, {
  m: 0,
  p: {},
});

export const MOCK_API_PRESETS: WLEDPresets = {
  1: {
    // TODO verify these fields
    n: 'Preset 1',
    playlist: { // TODO
      ps: [1, 2, 3],
      dur: [10, 10, 10],
      transition: [1, 1, 1],
      repeat: 3,
      end: undefined,
      // r: false,
    },
    // psave: 0,
    o: true, // TODO
    win: '', // TODO
    ql: 'P1',
    on: true, // TODO
    ib: true,
    sb: true,
    p: 0, // TODO
  },
  2: {
    // TODO verify these fields
    n: 'Preset 2',
    playlist: { // TODO
      ps: [1, 2, 3],
      dur: [10, 10, 10],
      transition: [1, 1, 1],
      repeat: 3,
      end: undefined,
      // r: false,
    },
    // psave: 0,
    o: true, // TODO
    win: '', // TODO
    ql: 'P2',
    on: true, // TODO
    ib: true,
    sb: true,
    p: 0, // TODO
  },
  3: {
    // TODO verify these fields
    n: 'Preset 3',
    playlist: { // TODO
      ps: [1, 2, 3],
      dur: [10, 10, 10],
      transition: [1, 1, 1],
      repeat: 3,
      end: undefined,
      // r: false,
    },
    // psave: 0,
    o: true, // TODO
    win: '', // TODO
    ql: 'P3',
    on: true, // TODO
    ib: true,
    sb: true,
    p: 0, // TODO
  },
  4: {
    // TODO verify these fields
    n: 'Preset 4',
    playlist: { // TODO
      ps: [1, 2, 3],
      dur: [10, 10, 10],
      transition: [1, 1, 1],
      repeat: 3,
      end: undefined,
      // r: false,
    },
    // psave: 0,
    o: true, // TODO
    win: '', // TODO
    ql: 'P4',
    on: true, // TODO
    ib: true,
    sb: true,
    p: 0, // TODO
  },
};

export const MOCK_LIVE_DATA: LiveViewData = {
  leds: [
    '00DB2E',
    '00D631',
    '02CC33',
    '02C733',
    '02BD38',
    '02B838',
    '04B13B',
    '04AC3B',
    '04A240',
    '049D40',
    '049342',
    '049142',
    '078744',
    '078247',
    '077849',
    '077349',
    '09694C',
    '09674E',
    '095D51',
    '095D4E',
    '095D4E',
    '095D4E',
    '095D51',
    '095D51',
    '095D4E',
    '095D4E',
    '095D4E',
    '095D4E',
    '095D51',
    '095D51',
    '096451',
    '096751',
    '0C6C51',
    '0C6E53',
    '0E7353',
    '0E7853',
    '0E7D53',
    '0E8053',
    '0E8456',
    '118C56',
    '0E8E56',
    '119658',
    '119858',
    '139D58',
    '13A058',
    '13A758',
    '13A95B',
    '13B15B',
    '16B35B',
    '16B85D',
    '18BD5D',
    '16BD5D',
    '16BD5D',
    '16BD5D',
    '16BB5D',
    '16BD5D',
    '16BD5D',
    '16BD5D',
    '16BD5D',
    '16BB5D',
    '16BB5D',
    '18BB5D',
    '18BB5D',
    '18B85B',
    '18B85B',
    '1BB858',
    '1BB858',
    '1BB658',
    '1BB658',
    '1DB356',
    '1DB356',
    '20B356',
    '20B153',
    '20B153',
    '20B153',
    '22AE53',
    '22AE51',
    '22AC51',
    '24AC51',
    '24AC4E',
    '24A94E',
    '24A94E',
    '24A051',
    '229653',
    '1D8456',
    '187B58',
    '13695D',
    '136260',
    '0E4E62',
    '094764',
    '043369',
    '042C69',
    '001B6E',
    '001B71',
    '001D78',
    '00207B',
    '022280',
    '022484',
    '042789',
    '04278C',
    '042991',
    '072C93',
    '072E9B',
    '09319D',
    '0933A4',
    '0933A7',
    '0938AC',
    '0C38AE',
    '0E3BB6',
    '0E3DB8',
    '0E40C0',
    '0E42C2',
    '1144C7',
    '1347CE',
    '1349D1',
    '134CD6',
    '134CD8',
    '164EE0',
    '1651E2',
    '1853E7',
    '1853E9',
    '1B58F1',
    '1B58F3',
    '1D5BF8',
    '1D5DFD',
    '1D5DFD',
    '1D5DFD',
    '1D5DFD',
    '1D5DFD',
    '1D5DFD',
    '1D5DFD',
    '1D5DFD',
    '1D5DFD',
    '1D5DFD',
    '1D5DFD',
    '1D64F6',
    '1D67F1',
    '1B71E4',
    '1876DD',
    '1880CE',
    '1684C9',
    '138CBB',
    '1391B3',
    '1198A7',
    '11A0A0',
    '0EA793',
    '0EAC8C',
    '0CB680',
    '09B878',
    '09C46C',
    '07CC60',
    '04D158',
    '04DB4C',
    '02E044',
    '00E938',
    '00EC31',
    '00F129',
    '00F129',
    '00F129',
    '00F129',
    '00F129',
    '00F129',
    '00F129',
    '00F12C',
    '00F129',
    '00F129',
    '00F12C',
    '00EC2C',
    '00E42E',
  ],
  n: 10,
};
