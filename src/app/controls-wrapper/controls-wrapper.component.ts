import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WLEDPresets } from '../shared/api-types/api-presets';
import { WLEDApiResponse } from '../shared/api-types/api-types';
import { AppStateService } from '../shared/app-state/app-state.service';
import { LocalStorageKey, LocalStorageService } from '../shared/local-storage.service';
import { AppUIConfig, UIConfigService } from '../shared/ui-config.service';
import { UnsubscriberComponent } from '../shared/unsubscriber/unsubscriber.component';
import { ControlsService } from './controls.service';
import { generateApiUrl } from './json.service';

@Component({
  selector: 'app-controls-wrapper',
  templateUrl: './controls-wrapper.component.html',
  styleUrls: ['./controls-wrapper.component.scss'],
})
export class ControlsWrapperComponent extends UnsubscriberComponent implements OnInit {
  private useCustomCss!: boolean;
  private enableHolidays!: boolean;
  private backgroundUrl!: string;
  private backgroundOpacity!: number;
  private holidayConfig = this.getDefaultHolidayConfig();

  // probably should be moved to a shared/different location
  // private sliderContainer!: HTMLElement; // sliding UI
  // private iSlide = 0; // related to sliding UI
  // private lastinfo = {};

  constructor(
    private controlsService: ControlsService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private appStateService: AppStateService,
    private uiConfigService: UIConfigService,
  ) {
    super();
  }

  ngOnInit() {
    const apiJson = this.route.snapshot.data['data'] as WLEDApiResponse;
    const presets = this.route.snapshot.data['presets'] as WLEDPresets;
    for (const key of ['state', 'info']) {
      console.log(key, apiJson[key as keyof WLEDApiResponse]);
    }
    // needed because only this response include palettes/effects lists
    this.appStateService.setAll(apiJson, presets);

    this.uiConfigService.getUIConfig(this.ngUnsubscribe)
      .subscribe((uiConfig) => {
        this.useCustomCss = uiConfig.useCustomCss;
        this.enableHolidays = uiConfig.enableHolidays;
        this.backgroundUrl  = uiConfig.theme.background.url;
        this.backgroundOpacity = uiConfig.theme.alpha.background;
        // save ui config in local storage
        this.localStorageService.set(LocalStorageKey.UI_CONFIG, uiConfig);
      });

    // this.webSocketService.sendMessage({ v: true });

    // load from local storage after setting up listeners above
    this.loadStoredUIConfig();
    this.loadHolidaysOrSkin();

    if (this.shouldEnableAppHeightHack()) {
      alert('app height fix enabled') // TODO remove
      this.setAppHeight();
      document.addEventListener('resize', this.setAppHeight);
    }

    // TODO remove?
    // this.setupRanges();

    // TODO call update size change
    // this.size();

    // TODO hide loading screen
    // document.getElementById('cv')!.style.opacity = `${0}`;

    // TODO load pc mode and update button
    // if (this.localStorageService.get('pcm') === 'true') {
    //   this.togglePcMode(true);
    // }
  }

  private setAppHeight = () => {
    const { documentElement: de } = document;
    de.style.setProperty('--app-height', `${window.innerHeight}px`);
    console.log('setAppHeight', window.innerHeight)
  }

  private shouldEnableAppHeightHack = () => {
    // only enable for mobile safari, for now
    const { userAgent } = navigator;
    const expectedKeywords = ['Safari', 'Mobile', 'AppleWebKit']
    for (const keyword of expectedKeywords) {
      if (!userAgent.includes(keyword)) {
        return false;
      }
    }
    return true;
  }

  private loadStoredUIConfig = () => {
    const defaultConfig: any = {}; // TODO better default
    const config = this.localStorageService.get<AppUIConfig>(LocalStorageKey.UI_CONFIG, defaultConfig);
    if (config) {
      this.uiConfigService.setAll(config);
    }
  }

  private loadHolidaysOrSkin = () => {
    // TODO move to loadHolidays() in controls service
    if (this.enableHolidays) { // should load custom holiday list
      const holidayJsonPath = generateApiUrl('holidays.json', true);
      // TODO use api service
      /* fetch(holidayJsonPath, { method: 'get' }) // may be loaded from external source
        .then(res => {
          //if (!res.ok) showErrorToast();
          return res.json();
        })
        .then(json => {
          if (Array.isArray(json)) {
            this.holidayConfig = json;
            // TODO: do some parsing first (aircookie comment)
          }
        })
        .catch((error) => {
          console.log('holidays.json does not contain array of holidays. Defaults loaded.');
        })
        .finally(() => {
          this.loadBackground(this.backgroundUrl);
        }); */
    } else {
      this.loadBackground(this.backgroundUrl);
    }
    if (this.useCustomCss) {
      this.loadSkinCSS('skinCss');
    }
  }

  // TODO better way to load background
  private loadBackground = (imageUrl: string) => {
    const backgroundElement = document.getElementById('bg')!;
    let imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    if (imageUrl === '') {
      this.loadHolidayBackground(imgElement);
    }
    imgElement.addEventListener('load', () => {
      const alpha = isNaN(this.backgroundOpacity)
        ? 0.6
        : this.backgroundOpacity;
      backgroundElement.style.opacity = `${alpha}`;
      backgroundElement.style.backgroundImage = `url(${imgElement.src})`;
    });
  }

  private loadHolidayBackground = (img: HTMLImageElement) => {
    const today = new Date();
    for (let i = 0; i < this.holidayConfig.length; i++) {
      const year = this.holidayConfig[i][0] === 0 ? today.getFullYear() : this.holidayConfig[i][0] as number;
      const startHour = new Date(year, this.holidayConfig[i][1] as number, this.holidayConfig[i][2] as number);
      const endHour = new Date(startHour);
      endHour.setDate(endHour.getDate().valueOf() + (this.holidayConfig[i][3] as number));
      if (today >= startHour && today <= endHour) {
        img.src = this.holidayConfig[i][4] as string;
      }
    }
  }

  private loadSkinCSS = (skinCssId: string) => {
    if (!document.getElementById(skinCssId)) { // check if element exists
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

  private getDefaultHolidayConfig() {
    // TODO use Date objects
    /* interface HolidayConfig {
      date: Date;
      imageUrl: string;
    } */
    return [
      [0, 11, 24, 4, 'https://aircoookie.github.io/xmas.png'], // Christmas
      [0, 2, 17, 1, 'https://images.alphacoders.com/491/491123.jpg'], // St. Patrick's Day
      [2022, 3, 17, 2, 'https://aircoookie.github.io/easter.png'],
      [2023, 3, 9, 2, 'https://aircoookie.github.io/easter.png'],
      [2024, 2, 31, 2, 'https://aircoookie.github.io/easter.png'],
    ];
  }
}

///////////////////////////////////////////////////
// helper functions (not tied to any view logic) //
///////////////////////////////////////////////////

const updateUI = () => {
  // TODO show/hide whiteness/kelvin sliders based on config
  // document.getElementById('wwrap')!.style.display = this.isRgbw ? 'block' : 'none';
  // document.getElementById('wbal')!.style.display = this.lastinfo.leds.cct ? 'block' : 'none';
  // document.getElementById('kwrap')!.style.display = this.lastinfo.leds.cct ? 'none' : 'block';

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
