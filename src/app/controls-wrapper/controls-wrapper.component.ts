import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import RangeTouch from 'rangetouch';
import { AppConfig, initAppConfig } from '../shared/app-config';
import { AppStateService } from '../shared/app-state/app-state.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { UnsubscribingComponent } from '../shared/unsubscribing.component';
import { WebSocketService } from '../shared/web-socket.service';
import { ControlsService } from './controls.service';
import { generateApiUrl } from './json.service';
import { SegmentsService } from './segments/segments.service';
import { getElementList, isObject } from './utils';

@Component({
  selector: 'app-controls-wrapper',
  templateUrl: './controls-wrapper.component.html',
  styleUrls: ['./controls-wrapper.component.scss'],
})
export class ControlsWrapperComponent extends UnsubscribingComponent implements OnInit {
  /* private hol = this.getDefaultHolidayConfig();

  // probably should be moved to a shared location
  private cfg = initAppConfig(); // TODO add reducers
  private sliderContainer!: HTMLElement; // sliding UI
  private iSlide = 0; // related to sliding UI
  private lastinfo = {}; */

  constructor(
    private controlsService: ControlsService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private appStateService: AppStateService,
    private segmentsService: SegmentsService,
  ) {
    super();
  }

  ngOnInit() {
    const apiData = this.route.snapshot.data['data'];
    console.log(apiData)
    // needed because other responses don't include palette/effects lists
    this.appStateService.setAll(apiData);
    // needed for offline mode to set the segments
    this.segmentsService.loadApiSegments(apiData.state.seg);

    // this.webSocketService.sendMessage({ v: true });
    // const { state, info } = response;
    // console.log(state, info)

    // TODO uncomment
    // this.setupRanges();
    // this.loadStoredConfig();
    // this.loadHolidaysOrSkin();

    // TODO make a call to `/json` (gets full app data) but wait 50ms (is this ms value needed/changeable?)
    // setTimeout(() => {
    //   this.requestJson(null, false);
    // }, 50);

    // TODO call update size change
    // this.size();

    // TODO hide loading screen
    // document.getElementById('cv')!.style.opacity = `${0}`;

    // TODO load pc mode and update button
    // if (this.localStorageService.get('pcm') === 'true') {
    //   this.togglePcMode(true);
    // }
  }

  /*private loadStoredConfig() {
    const config = this.localStorageService.get<AppConfig>('wledUiCfg');
    if (config) {
      this.cfg = mergeDeep(this.cfg, config);
    }
  }

  private loadHolidaysOrSkin() {
    // TODO move to loadHolidays() in controls service
    if (this.cfg.comp.hdays) { // should load custom holiday list
      const holidayJsonPath = generateApiUrl('holidays.json', true);
      fetch(holidayJsonPath, { method: 'get' }) // may be loaded from external source
        .then(res => {
          //if (!res.ok) showErrorToast();
          return res.json();
        })
        .then(json => {
          if (Array.isArray(json)) {
            this.hol = json;
            // TODO: do some parsing first (aircookie comment)
          }
        })
        .catch((error) => {
          console.log('holidays.json does not contain array of holidays. Defaults loaded.');
        })
        .finally(() => {
          this.loadBackground(this.cfg.theme.bg.url);
        });
    } else {
      this.loadBackground(this.cfg.theme.bg.url);
    }
    if (this.cfg.comp.css) {
      this.loadSkinCSS('skinCss');
    }
  }

  private loadBackground(imageUrl: string) {
    const bg = document.getElementById('bg')!;
    let img = document.createElement('img') as HTMLImageElement;
    img.src = imageUrl;
    if (imageUrl === '') {
      this.loadHolidayBackground(img);
    }
    img.addEventListener('load', (event) => {
      let alpha = this.cfg.theme.alpha.bg; // parseFloat(this.cfg.theme.alpha.bg);
      if (isNaN(alpha)) {
        alpha = 0.6;
      }
      bg.style.opacity = `${alpha}`;
      bg.style.backgroundImage = `url(${img.src})`;
      // img = null; // TODO is this just fake garbage collection?
    });
  }

  private loadHolidayBackground(img: HTMLImageElement) {
    const today = new Date();
    for (let i = 0; i < this.hol.length; i++) {
      const year = this.hol[i][0] === 0 ? today.getFullYear() : this.hol[i][0] as number;
      const hs = new Date(year, this.hol[i][1] as number, this.hol[i][2] as number);
      const he = new Date(hs);
      he.setDate(he.getDate().valueOf() + (this.hol[i][3] as number));
      if (today >= hs && today <= he) {
        img.src = this.hol[i][4] as string;
      }
    }
  }

  private loadSkinCSS(skinCssId: string) {
    if (!document.getElementById(skinCssId))	// check if element exists
    {
      const documentHead = document.getElementsByTagName('head')[0];
      const stylesheet = document.createElement('link');
      stylesheet.id = skinCssId;
      stylesheet.rel = 'stylesheet';
      stylesheet.type = 'text/css';
      stylesheet.href = generateApiUrl('skin.css', true);
      stylesheet.media = 'all';
      documentHead.appendChild(stylesheet);
    }
  }

  private setupRanges() {
    // TODO need to call this in child comps? or just in after view init?
    const ranges = RangeTouch.setup('input[type="range"]', {});
    console.log('rangetouch', RangeTouch, ranges)

    // TODO add event listeners to ranges
    const sls = getElementList('input[type="range"]') as HTMLInputElement[];
    for (const sl of sls) {
      sl.addEventListener('input', this.updateBubble, true);
      sl.addEventListener('touchstart', this.toggleBubble);
      sl.addEventListener('touchend', this.toggleBubble);
    }
  }

  // rangetouch slider function
  private updateBubble(event: Event) {
    const element = event.target as HTMLInputElement;
    const parent = element.parentNode as HTMLElement;
    const bubble = parent.getElementsByTagName('output')[0];
    if (bubble) {
      bubble.innerHTML = element.value;
    }
  }

  // rangetouch slider function
  private toggleBubble(event: Event) {
    const element = event.target as HTMLInputElement;
    element.parentNode!.querySelector('output')!.classList.toggle('hidden');
  }

  private getDefaultHolidayConfig() {
    return [
      [0, 11, 24, 4, 'https://aircoookie.github.io/xmas.png'], // christmas
      [0, 2, 17, 1, 'https://images.alphacoders.com/491/491123.jpg'], // st. Patrick's day
      [2022, 3, 17, 2, 'https://aircoookie.github.io/easter.png'],
      [2023, 3, 9, 2, 'https://aircoookie.github.io/easter.png'],
      [2024, 2, 31, 2, 'https://aircoookie.github.io/easter.png'],
    ];
  }*/
}

///////////////////////////////////////////////////
// helper functions (not tied to any view logic) //
///////////////////////////////////////////////////

// TODO probably not needed, can use app state service instead
const mergeDeep: any = (target: any, ...sources: any[]) => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
};

// TODO probably won't need this once form templates are set up
const updateUI = () => {
  // TODO update active appearance of buttons
  // document.getElementById('buttonPower')!.className = this.isOn ? 'active' : '';
  // document.getElementById('buttonNl')!.className = this.nlA ? 'active' : '';
  // document.getElementById('buttonSync')!.className = this.syncSend ? 'active' : '';

  // TODO update slider trails

  // TODO show/hide whiteness/kelvin sliders based on config
  // document.getElementById('wwrap')!.style.display = this.isRgbw ? 'block' : 'none';
  // document.getElementById('wbal')!.style.display = this.lastinfo.leds.cct ? 'block' : 'none';
  // document.getElementById('kwrap')!.style.display = this.lastinfo.leds.cct ? 'none' : 'block';

  // TODO update presets UI
  // this.updatePA();

  // TODO update other sliders
  // this.updatePSliders();
}

// TODO unused
const unfocusSliders = () => {
  // in top menu bar (for now?)
  document.getElementById('sliderBri')!.blur();
  
  // both in effects component
  document.getElementById('sliderSpeed')!.blur();
  document.getElementById('sliderIntensity')!.blur();
}

// TODO unused
const openGithubWiki = () => {
  window.open('https://github.com/Aircoookie/WLED/wiki');
}

////////////////////////////////////////
// relocated private variables        //
// TODO delete once controls wired up //
////////////////////////////////////////

// moved to color service
// private selectedColorSlot = 0;
// private whites = [0, 0, 0];

// moved to color presets component
// private lasth = 0;

// moved to json service
// private jsonTimeout: number;
// private lastUpdate = 0; // last call to requestJson()
// private ws; // websocket
// private loc = false;
// private locip;
// private reqsLegal = false;
// private isRgbw = false;

// moved to effects component
// private fxlist = document.getElementById('fxlist');

// moved to palettes component
// private pallist = document.getElementById('pallist');
// private palettesData;
// private selColors;

// moved to segments component
// private segCount = 0
// private lowestUnused = 0
// private lSeg = 0;
// private noNewSegs = false;
// private powered = [true];
// private maxSeg = 0
// private ledCount = 0

// safely removed
// private d = document;

// moved to top menu component
// private isOn = false
// private nlA = false
// private nlDur = 60
// private nlTar = 0;
// private nlMode = false;
// private syncSend = false
// private syncTglRecv = true
// private isLv = false
// private isInfo = false
// private isNodes = false
// private appWidth: number = 0;
// private pcMode = false
// private pcModeA = false
// private x0 = null;
// private lastw = 0;
// private locked = false;
// private scrollS = 0;
// private N = 4;

// moved to info component
// private hc = 0;

// moved to toast comp
// private toastTimeout;

// moved to presets comp
// private pJson = {};
// private pQL = [];
// private pNum = 0;
// private pmt = 1
// private pmtLS = 0
// private pmtLast = 0;
// private expanded = [false];
// private currentPreset = -1;
// private tr = 7;
// private pN = ''; // current playlist/preset name
// private pI = 0; // current playlist/preset id
/*private plJson = {
  '0': {
    ps: [0],
    dur: [100],
    transition: [-1],	// to be initiated to default transition dur
    repeat: 0,
    r: false,
    end: 0,
  },
};//*/
