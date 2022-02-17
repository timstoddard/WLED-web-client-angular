import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { AppConfig } from '../shared/app-config';
import { LocalStorageService } from '../shared/local-storage.service';
import { ControlsServicesModule } from './controls-services.module';
import { asHtmlElem, getInput, setCssColor } from './utils';

// TODO should this be provided at root?
@Injectable({ providedIn: ControlsServicesModule })
export class JsonService {
  private jsonTimeout!: number;
  private lastUpdate = 0; // last call to requestJson()
  // TODO need to export this somehow (maybe own websocket service?)
  private ws!: WebSocket; // websocket
  private loc = false;
  private locip: string | null = null;
  private reqsLegal = false;
  private isRgbw = false;

  constructor(
    private apiService: ApiService,
    private localStorageService: LocalStorageService) {}

  init() {
    this.getLocIp();
    this.applyCfg({} as AppConfig); // TODO get actual config
    document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
  }

  private getLocIp() {
    if (window.location.protocol === 'file:') {
      this.loc = true;
      const locip = this.localStorageService.get<string>('locIp');
      if (locip) {
        this.locip = locip;
      } else {
        const userInputLocip = prompt('File Mode. Please enter WLED IP!');
        if (userInputLocip) {
          this.locip = userInputLocip;
          this.localStorageService.set('locIp', this.locip);
        }
      }
    }
  }

  private makeWS() {
    if (this.ws) {
      return;
    }
    this.ws = new WebSocket('ws://' + (this.loc ? this.locip : window.location.hostname) + '/ws');
    // TODO missing param? onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null; - lib.dom.d.ts
    this.ws.onmessage = (event: MessageEvent) => {
      const json = JSON.parse(event.data);
      if (json.leds) {
        return; // liveview packet
      }
      clearTimeout(this.jsonTimeout);
      this.jsonTimeout = -1;
      // this.clearErrorToast();
      document.getElementById('connind')!.style.backgroundColor = '#079';
      const { info } = json;
      document.getElementById('buttonNodes')!.style.display =
        info.ndc > 0 && window.innerWidth > 770
          ? 'block'
          : 'none';
      //

      // TODO store most recent `info` for later use
      // this.lastinfo = info;

      // TODO render info component
      // if (this.isInfo) {
      //   this.populateInfo(info);
      // }

      // TODO couldn't find declaration of `s`
      // s = json.state;

      // TODO display "rover"
      // this.displayRover(info, json.state);

      this.readState(json.state);
    };
    // TODO missing param? onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
    this.ws.onclose = (/*event: CloseEvent*/) => {
      document.getElementById('connind')!.style.backgroundColor = '#831';
    }
  }

  private requestJson(command: any /* TODO type */, rinfo = true) {
    document.getElementById('connind')!.style.backgroundColor = '#a90';
    if (command && !this.reqsLegal) {
      return; // stop post requests from chrome onchange event on page restore
    }
    this.lastUpdate = new Date().valueOf();
    if (!this.jsonTimeout) {
      // TODO set request timeout for 3000ms, then show error message
      // this.jsonTimeout = setTimeout(showErrorToast, 3000) as unknown as number;
    }
    let req = null;

    // const path = rinfo
    //   ? 'json/si'
    //   : (command ? 'json/state' : 'json');
    // const url = generateApiUrl(path);

    let useWs = (command || rinfo)
      && this.ws
      && this.ws.readyState === WebSocket.OPEN;

    if (command) {
      command.v = true; //get complete API response
      command.time = Math.floor(Date.now() / 1000);
      const t = document.getElementById('tt')!;

      // TODO is transition input is valid, use transition input value for command transition value
      /*if (t.validity.valid && command.transition === undefined) {
        const tn = parseInt(t.value, 10) * 10;
        if (tn !== this.tr) {
          command.transition = tn;
        }
      }//*/

      req = JSON.stringify(command);
      if (req.length > 1000) {
        useWs = false; // do not send very long requests over websocket
      }
    }

    if (useWs) {
      this.ws.send(req ? req : '{"v":true}');
      return;
    }

    // TODO call api service to request json
    /*this.controlsService.requestJson(command, rinfo)
      .subscribe((json) => {
        this.handleJsonResponse(json, command, rinfo);
      }, (error) => {
        // showToast(error, true);
        console.log(error);
      });//*/

    // fetch(url, {
    //   method: type,
    //   headers: { 'Content-type': 'application/json; charset=UTF-8' },
    //   body: req
    // })
    // .then(res => {
    //   if (!res.ok) {
    //     showErrorToast();
    //   }
    //   return res.json();
    // })
    // .then(json => {
    //   this.handleJsonResponse(command, rinfo);
    // })
    // .catch();
  }

  private handleJsonResponse(json: any, command: any /* TODO type */, rinfo = true) {
    clearTimeout(this.jsonTimeout);
    this.jsonTimeout = -1;
    // this.clearErrorToast();
    document.getElementById('connind')!.style.backgroundColor = '#070';
    if (!json) {
      // showToast('Empty response', true);
    }
    if (json.success) {
      return;
    }
    let s = json;

    if (!command || rinfo) { // we have info object
      if (!rinfo) { //entire JSON (on load)
        // TODO load effects and palettes
        // this.populateEffects(json.effects);
        // this.populatePalettes(json.palettes);

        // TODO load palette previews, presets, and open websocket sequentially
        /*setTimeout(() => {
          this.loadPresets(() => {
            this.loadPalettesData(() => {
              if (!this.ws && json.info.ws > -1) {
                this.makeWS();
              }
            });
          });
        }, 25);//*/

        this.reqsLegal = true;
      }

      const { info } = json;
      let { name } = info;
      document.getElementById('namelabel')!.innerHTML = name;
      if (name === "Dinnerbone") {
        document.documentElement.style.transform = "rotate(180deg)";
      }
      if (info.live) {
        name = `(Live) ${name}`;
      }
      if (this.loc) {
        name = `(L) ${name}`;
      }
      // ${docume}nt.title = name;
      this.isRgbw = info.leds.wv;
      // this.ledCount = info.leds.count;
      // this.syncTglRecv = info.str;
      // this.maxSeg = info.leds.maxseg;
      // this.pmt = info.fs.pmt;

      if (!command && rinfo) {
        // TODO load preset data
        // setTimeout(this.loadPresets, 99);
      }

      document.getElementById('buttonNodes')!.style.display =
        info.ndc > 0 && window.innerWidth > 770
          ? 'block'
          : 'none';
      //

      // TODO store most recent `info` for later use
      // this.lastinfo = info;

      // TODO populate info if currently showing info component
      // if (this.isInfo) {
      //   this.populateInfo(info);
      // }

      s = json.state;

      // TODO display "rover"
      // this.displayRover(info, s);
    }

    this.readState(s, command);
  }






  // TODO how to incorporate these functions (here or elsewhere)

  private handleVisibilityChange() {
    const msSinceUpdate = new Date().valueOf() - this.lastUpdate;
    // TODO what is a case where document.hidden would be true
    if (!document.hidden && msSinceUpdate > 3000) {
      // this.requestJson(null);
    }
  }

  private applyCfg(config: AppConfig) {
    this.setTheme(config.theme.base === 'light');
    const bg = config.theme.color.bg;
    if (bg) {
      setCssColor('--c-1', bg);
    }

    // TODO show/hide color sliders based on config settings
    // const ccfg = config.comp.colors;
    // document.getElementById('hexw')!.style.display = ccfg.hex ? 'block' : 'none';
    // document.getElementById('picker')!.style.display = ccfg.picker ? 'block' : 'none';
    // document.getElementById('vwrap')!.style.display = ccfg.picker ? 'block' : 'none';
    // document.getElementById('kwrap')!.style.display = ccfg.picker ? 'block' : 'none';
    // document.getElementById('rgbwrap')!.style.display = ccfg.rgb ? 'block' : 'none';
    // document.getElementById('qcs-w')!.style.display = ccfg.quick ? 'block' : 'none';
    
    const labels = config.comp.labels;
    let e: any = document.querySelectorAll('.tab-label');
    for (let i = 0; i < e.length; i++) {
      e[i].style.display = labels ? 'block' : 'none';
    }
    e = document.querySelector('.hd');
    e.style.display = labels ? 'block' : 'none';
    setCssColor('--tbp', labels ? '14px 14px 10px 14px' : '10px 22px 4px 22px');
    setCssColor('--bbp', labels ? '9px 0 7px 0' : '10px 0 4px 0');
    setCssColor('--bhd', labels ? 'block' : 'none');
    setCssColor('--bmt', labels ? '0px' : '5px');
    setCssColor('--t-b', `${config.theme.alpha.tab}`);
    // TODO call update size change
    // this.size();
    this.localStorageService.set('wledUiCfg', config);
  }

  tglHex(config: AppConfig) {
    config.comp.colors.hex = !config.comp.colors.hex;
    this.applyCfg(config);
  }

  // moved to top menu bar component
  // tglTheme(config: AppConfig) {
  //   config.theme.base = (config.theme.base === 'light') ? 'dark' : 'light';
  //   this.applyCfg(config);
  // }

  // moved to effects component
  // tglLabels(config: AppConfig) {
  //   config.comp.labels = !config.comp.labels;
  //   this.applyCfg(config);
  // }

  private setTheme(isLight: boolean) {
    if (isLight) {
      setCssColor('--c-1', '#eee');
      setCssColor('--c-f', '#000');
      setCssColor('--c-2', '#ddd');
      setCssColor('--c-3', '#bbb');
      setCssColor('--c-4', '#aaa');
      setCssColor('--c-5', '#999');
      setCssColor('--c-6', '#999');
      setCssColor('--c-8', '#888');
      setCssColor('--c-b', '#444');
      setCssColor('--c-c', '#333');
      setCssColor('--c-e', '#111');
      setCssColor('--c-d', '#222');
      setCssColor('--c-r', '#c42');
      setCssColor('--c-o', 'rgba(204, 204, 204, 0.9)');
      setCssColor('--c-sb', '#0003');
      setCssColor('--c-sbh', '#0006');
      setCssColor('--c-tb', 'rgba(204, 204, 204, var(--t-b))');
      setCssColor('--c-tba', 'rgba(170, 170, 170, var(--t-b))');
      setCssColor('--c-tbh', 'rgba(204, 204, 204, var(--t-b))');
      document.getElementById('imgw')!.style.filter = 'invert(0.8)';
    } else {
      setCssColor('--c-1', '#111');
      setCssColor('--c-f', '#fff');
      setCssColor('--c-2', '#222');
      setCssColor('--c-3', '#333');
      setCssColor('--c-4', '#444');
      setCssColor('--c-5', '#555');
      setCssColor('--c-6', '#666');
      setCssColor('--c-8', '#888');
      setCssColor('--c-b', '#bbb');
      setCssColor('--c-c', '#ccc');
      setCssColor('--c-e', '#eee');
      setCssColor('--c-d', '#ddd');
      setCssColor('--c-r', '#831');
      setCssColor('--c-o', 'rgba(34, 34, 34, 0.9)');
      setCssColor('--c-sb', '#fff3');
      setCssColor('--c-sbh', '#fff5');
      setCssColor('--c-tb', 'rgba(34, 34, 34, var(--t-b))');
      setCssColor('--c-tba', 'rgba(102, 102, 102, var(--t-b))');
      setCssColor('--c-tbh', 'rgba(51, 51, 51, var(--t-b))');
      document.getElementById('imgw')!.style.filter = 'unset';
    }
  }

  // TODO turn this into reducers
  private readState(s: any /* TODO type */, command = false) {
    // TODO set app state based on `s`
    // isOn = s.on;
    // document.getElementById('sliderBri')!.value = s.bri;
    // nlA = s.nl.on;
    // nlDur = s.nl.dur;
    // nlTar = s.nl.tbri;
    // nlMode = s.nl.mode;
    // syncSend = s.udpn.send;
    // currentPreset = s.ps;
    // tr = s.transition;

    // TODO set transition input
    // document.getElementById('tt')!.value = tr / 10;

    let selc = 0;
    let ind = 0;
    // TODO better solution than `|| []`
    for (let i = 0; i < (s.seg || []).length; i++) {
      if (s.seg[i].sel) {
        selc = ind;
        break;
      }
      ind++;
    }
    const i = s.seg[selc];
    if (!i) {
      // showToast('No Segments!', true);
      // TODO callback to update UI
      // this.updateUI();
      return;
    }

    // this.selColors = i.col;

    // TODO update color slot component
    const cd = document.getElementById('csl')!.children;
    for (let e = 2; e >= 0; e--) {
      asHtmlElem(cd[e]).style.backgroundColor = `rgb(${i.col[e][0]},${i.col[e][1]},${i.col[e][2]})`;
      if (this.isRgbw) {
        // TODO update whites value (color service)
        // this.whites[e] = parseInt(i.col[e][3]);
      }
      // TODO update selected slot (color service)
      // this.selectSlot(this.selectedColorSlot);
    }
    if (i.cct !== null && i.cct >= 0) {
      getInput('sliderA')!.value = i.cct;
    }

    getInput('sliderSpeed')!.value = i.sx;
    getInput('sliderIntensity')!.value = i.ix;

    // TODO add selected class to selected effect
    // TODO add selected class to selected palette

    // Effects
    // const selFx = fxlist.querySelector(`input[name="fx"][value="${i.fx}"]`);
    // if (selFx) {
    //   selFx.checked = true;
    // } else {
    //   location.reload(); //effect list is gone (e.g. if restoring tab). Reload.
    // }

    // const selElement = fxlist.querySelector('.selected');
    // if (selElement) {
    //   selElement.classList.remove('selected')
    // }
    // const selectedEffect = fxlist.querySelector(`.lstI[data-id="${i.fx}"]`);
    // selectedEffect.classList.add('selected');
    // selectedFx = i.fx;

    // Palettes
    // pallist.querySelector(`input[name="palette"][value="${i.pal}"]`)!.checked = true;
    // selElement = pallist.querySelector('.selected');
    // if (selElement) {
    //   selElement.classList.remove('selected');
    // }
    // pallist.querySelector(`.lstI[data-id="${i.pal}"]`).classList.add('selected');

    // TODO scroll selected effect into view
    /*if (!command) {
      selectedEffect.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }//*/

    if (s.error && s.error !== 0) {
      const errorMessage = getErrorMessage(s.error);
      // showToast(`Error ${s.error}: ${errorMessage}`, true);
    }
    // TODO callback to update UI
    // this.updateUI();
  }
}





const getErrorMessage = (errorCode: number) => {
  switch (errorCode) {
    case 10:
      return 'Could not mount filesystem!';
    case 11:
      return 'Not enough space to save preset!';
    case 12:
      return 'Preset not found.';
    case 19:
      return 'A filesystem error has occurred.';
    default:
      return 'Unknown error occurred.';
  }
};

// TODO implement
export const generateApiUrl = (path: string, isFile = false) => {
  return '';
  // const prefix = isFile ? './' : '/'; // TODO can this always be `/`?
  // return this.loc
  //   ? `${prefix}${path}`
  //   : `http://${this.locip}/${path}`;
}
