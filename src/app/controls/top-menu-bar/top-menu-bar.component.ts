import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AppConfig } from '../../shared/app-config';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { generateApiUrl } from '../json.service';
import { MenuBarButton, setCssColor, updateTablinks } from '../utils';

const DEFAULT_BRIGHTNESS = 128;

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.scss']
})
export class TopMenuBarComponent extends UnsubscribingComponent implements OnInit {
  @Input() cfg!: AppConfig; // TODO get from service/reducer
  brightnessControl!: FormControl;

  // button controls
  private isOn = false;
  private isNightLightActive = false;
  private nightLightDuration = 60;
  private nightLightTar = 0; // TODO better name
  private nightLightMode = false;
  private isSyncSend = false;
  private syncTglRecv = true;
  isLiveViewActive = true; // false; // TODO just for testing
  private showInfo = false;
  private showNodes = false;

  // other vars (some are for sliding ui)
  private appWidth: number = 0;
  private pcMode = false;
  private pcModeA = false;
  private x0 = null;
  private lastw = 0;
  private locked = false;
  private scrollS = 0;
  private N = 4;

  topBarButtons: MenuBarButton[] = [
    {
      name: 'Power',
      onClick: this.togglePower,
      icon: '&#xe08f;',
    },
    {
      name: 'Timer',
      onClick: this.toggleNightLight,
      icon: '&#xe2a2;',
    },
    {
      name: 'Sync',
      onClick: this.toggleSync,
      icon: '&#xe116;',
    },
    {
      name: 'Peek',
      onClick: this.toggleLiveView,
      icon: '&#xe410;',
    },
    {
      name: 'Info',
      onClick: this.toggleShowInfo,
      icon: '&#xe066;',
    },
    {
      name: 'Nodes',
      onClick: this.toggleShowNodes,
      icon: '&#xe22d;',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.brightnessControl = this.createFormControl();

    // TODO evaluate if needed
    /* this.size();
    updateTablinks(0);
    window.addEventListener('resize', this.size, false); */

    // TODO slider stuff could be extracted into its own component/service
    // TODO re-implement sliding UI
    /*this.sliderContainer.addEventListener('mousedown', this.lock, false);
    this.sliderContainer.addEventListener('touchstart', this.lock, false);

    this.sliderContainer.addEventListener('mouseout', this.move, false);
    this.sliderContainer.addEventListener('mouseup', this.move, false);
    this.sliderContainer.addEventListener('touchend', this.move, false);//*/

    // TODO update sliding UI
    // this.sliderContainer = document.querySelector('.container')!;
    // this.sliderContainer.style.setProperty('--n', `${this.N}`);
  }

  togglePower() {
    this.isOn = !this.isOn;
    var obj = { on: this.isOn };
    // requestJson(obj);
  }

  toggleNightLight() {
    this.isNightLightActive = !this.isNightLightActive;
    const message = this.isNightLightActive
      ? `Timer active. Your light will turn ${this.nightLightTar > 0 ? 'on' : 'off'} ${this.nightLightMode ? 'over' : 'after'} ${this.nightLightDuration} minutes.`
      : 'Timer deactivated.'
    // showToast(message);

    // TODO update api
    var obj = { nl: { on: this.isNightLightActive } };
    // this.requestJson(obj);
  }

  private toggleSync() {
    this.isSyncSend = !this.isSyncSend;
    const message = this.isSyncSend
      ? 'Other lights in the network will now sync to this one.'
      : 'This light and other lights in the network will no longer sync.';
    // showToast(message);
    
    // TODO update api
    /*var obj = {
      udpn: { send: this.syncSend },
    };
    if (this.syncTglRecv) {
      obj.udpn.recv = this.syncSend;
    }//*/
    // this.requestJson(obj);
  }

  private toggleLiveView() {
    this.isLiveViewActive = !this.isLiveViewActive;
    const liveViewIframe = document.getElementById('liveview')! as HTMLIFrameElement;
    liveViewIframe.style.display = this.isLiveViewActive ? 'block' : 'none';
    document.getElementById('buttonSr')!.className = this.isLiveViewActive ? 'active' : '';

    const url = generateApiUrl('liveview')
    liveViewIframe.src = this.isLiveViewActive ? url : 'about:blank';
    
    // TODO send websocket message to disable if live view setting was turned off
    // if (!this.isLiveViewActive && ws && ws.readyState === WebSocket.OPEN) {
    //   ws.send('{"lv":false}');
    // }
    this.size();
  }

  private toggleShowInfo() {
    // TODO better way to close nodes if open
    if (this.showNodes) {
      this.toggleShowNodes();
    }

    this.showInfo = !this.showInfo;
    if (this.showInfo) {
      // TODO render info
      // this.populateInfo(this.lastinfo);
    }
    document.getElementById('info')!.style.transform = this.showInfo ? 'translateY(0px)' : 'translateY(100%)';
    document.getElementById('buttonI')!.className = this.showInfo ? 'active' : '';
  }

  private toggleShowNodes() {
    // TODO better way to close info if open
    if (this.showInfo) {
      this.toggleShowInfo();
    }

    this.showNodes = !this.showNodes;
    document.getElementById('nodes')!.style.transform =
      this.showNodes
        ? 'translateY(0px)'
        : 'translateY(100%)';
    document.getElementById('buttonNodes')!.className =
      this.showNodes
        ? 'active'
        : '';
    if (this.showNodes) {
      this.loadNodes();
    }
  }

  private loadNodes() {
    const url = generateApiUrl('json/nodes');

    fetch(url, { method: 'get' })
      .then(res => {
        if (!res.ok) {
          // showToast('Could not load Node list!', true);
        }
        return res.json();
      })
      .then(json => {
        // TODO render nodes
        // this.populateNodes(this.lastinfo, json);
      })
      .catch((error) => {
        // showToast(error, true);
        console.log(error);
      });
  }

  /**
   * Toggles between light and dark mode.
   * @param config 
   */
  toggleTheme(/*config: AppConfig*/) {
    // TODO wire up to api
    // config.theme.base = (config.theme.base === 'light') ? 'dark' : 'light';
    // this.applyCfg(config);
  }

  togglePcMode(fromB = false) { // TODO "from b" seems to be "called from button"
    if (fromB) {
      this.pcModeA = !this.pcModeA;
      this.localStorageService.set('pcm', this.pcModeA);
      this.pcMode = this.pcModeA;
    }
    if (this.appWidth < 1250 && !this.pcMode) {
      return;
    }
    if (!fromB && ((this.appWidth < 1250 && this.lastw < 1250) || (this.appWidth >= 1250 && this.lastw >= 1250))) {
      return;
    }
    // this.openTab(0, true);
    if (this.appWidth < 1250) {
      this.pcMode = false;
    }
    else if (this.pcModeA && !fromB) {
      this.pcMode = this.pcModeA;
    }
    // TODO select tab
    // this.updateTablinks(0);

    // TODO update pc mode button (active or not)
    // document.getElementById('buttonPcm')!.className = this.pcMode ? 'active' : '';
    
    // TODO show/hide bottom tab buttons, per some condition
    // document.getElementById('bot')!.style.height = (this.pcMode && !this.cfg.comp.pcmbot) ? '0' : 'auto';
    // TODO update "bottom bar height" in css, related to above line
    // setCssColor('--bh', document.getElementById('bot')!.clientHeight + 'px');

    // TODO update slider container width
    // this.sliderContainer.style.width = this.pcMode ? '100%' : '400%';
    
    this.lastw = this.appWidth;
  }

  private createFormControl() {
    const control = this.formBuilder.control(DEFAULT_BRIGHTNESS);
    control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((brightness: number) => {
        // TODO call service here
        console.log('brightness=', brightness);
      });
    return control;
  }

  // TODO probably not needed soon?
  /**
   * Sets the app width and height based on the current client dimensions.
   */
  private size() {
    this.appWidth = window.innerWidth;
    const lastinfo = { ndc: 0 }; // TODO get info from config/reducer
    document.getElementById('buttonNodes')!.style.display =
      (lastinfo.ndc > 0 && this.appWidth > 770)
        ? 'block'
        : 'none';
    let h = document.getElementById('top')!.clientHeight;
    setCssColor('--th', h + 'px');
    setCssColor('--bh', document.getElementById('bot')!.clientHeight + 'px');
    setCssColor('--tp', h + 'px');
    if (this.isLiveViewActive) {
      h -= 4;
    }
    this.togglePcMode();
  }

  /**
   * Slides and unlocks slider container on mouseup/touchend.
   * @param e 
   * @returns 
   */
  private move(e: MouseEvent | TouchEvent) {
    // TODO re-implement sliding UI
    /*if (!this.locked || this.pcMode) {
      return;
    }
    const clientX = unify(e).clientX;
    const dx = clientX - this.x0;
    const s = Math.sign(dx);
    let f = +(s * dx / this.appWidth).toFixed(2);

    if ((clientX !== 0) &&
      (this.iSlide > 0 || s < 0) && (this.iSlide < this.N - 1 || s > 0) &&
      f > 0.12 &&
      document.getElementsByClassName('tabcontent')[this.iSlide].scrollTop === this.scrollS) {
      this.sliderContainer.style.setProperty('--i', this.iSlide -= s);
      f = 1 - f;
      // TODO select tab
      // updateTablinks(this.iSlide);
    }
    this.sliderContainer.style.setProperty('--f', f);
    this.sliderContainer.classList.toggle('smooth', !(this.locked = false));
    this.x0 = null;//*/
  }

  /**
   * Locks slider container on mousedown/touchstart.
   */
  private lock(e: MouseEvent | TouchEvent) {
    // TODO re-implement sliding UI
    /*if (this.pcMode) {
      return;
    }

    const hasIroClass = (classList: string[]) => {
      for (let i = 0; i < classList.length; i++) {
        const element = classList[i];
        if (element.startsWith('Iro')) {
          return true;
        }
      }

      return false;
    }
    const { classList } = e.target;
    const { classList: parentClassList } = e.target.parentElement;

    if (
      classList.contains('noslide') ||
      hasIroClass(classList) ||
      hasIroClass(parentClassList)
    ) {
      return;
    }

    this.x0 = unify(e).clientX;
    this.scrollS = document.getElementsByClassName('tabcontent')[this.iSlide].scrollTop;

    this.sliderContainer.classList.toggle('smooth', !(this.locked = true));
    //*/
  }
}

const unify = (e: TouchEvent /* TODO correct type? also mouse event? */) => e.changedTouches
  ? e.changedTouches[0]
  : e;
//
