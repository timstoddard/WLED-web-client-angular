import { OriginConnectionPosition, OverlayConnectionPosition, ConnectionPositionPair } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { WledApiResponse } from '../../shared/api-types';
import { AppConfig } from '../../shared/app-config';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { WebSocketService } from '../../shared/web-socket.service';
import { generateApiUrl } from '../json.service';
import { genericPostResponse, MenuBarButton, setCssColor } from '../utils';
import { TopMenuBarService } from './top-menu-bar.service';

const DEFAULT_BRIGHTNESS = 128;
const MIN_SHOW_BRIGHTNESS_SLIDER_THRESHOLD_PX = 600;
const MIN_SHOW_PC_MODE_BUTTON_THRESHOLD_PX = 1200; // TODO might need to be bigger

class TopMenuBarButtonName {
  static readonly POWER = 'Power';
  static readonly TIMER = 'Timer'; // TODO better name (this is really "night light" feature)
  static readonly SYNC = 'Sync';
  static readonly LIVE = 'Live';
  static readonly PC_MODE = 'PC Mode';
}

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.scss'],
  host: { '(window:resize)': 'onResize($event)' },
})
export class TopMenuBarComponent extends UnsubscribingComponent implements OnInit {
  @Input() cfg!: AppConfig; // TODO get from service/reducer
  buttons: MenuBarButton[] = [];
  brightnessControl!: FormControl;
  isBrightnessOpen: boolean = false;
  showBrightnessSlider: boolean = false;
  showPcModeButton: boolean = false;

  // button controls
  private isOn = false;
  private isNightLightActive = false;
  private nightLightDuration = 60;
  private nightLightTar = 0; // TODO better name
  private nightLightMode = false;
  private shouldSync = false;
  private shouldToggleReceiveWithSend = true;
  isLiveViewActive = false;
  private showInfo = false;
  private showNodes = false;

  // other vars (some are for sliding ui)
  private appWidth: number = 0;
  private processingStatus!: { [key: string]: boolean };
  private isPcMode = false;
  private pcModeA = false;
  private x0 = null;
  private lastw = 0;
  private locked = false;
  private scrollS = 0;
  private N = 4;

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private topMenuBarService: TopMenuBarService,
    private appStateService: AppStateService,
    private changeDetectorRef: ChangeDetectorRef,
    private webSocketService: WebSocketService,
  ) {
    super();
  }

  ngOnInit() {
    this.brightnessControl = this.createFormControl();
    this.onResize();
    this.buttons = this.getButtons();
    this.processingStatus = {};

    this.appStateService.getAppState(this.ngUnsubscribe)
      .subscribe(n => {
        console.log(n); // TODO remove

        // update UI data
        const isOnChanged = this.isOn === n.state.on;
        this.isOn = n.state.on;
        this.isNightLightActive = n.state.nightLight.on;
        this.shouldSync = n.state.udp.shouldSend;
        // TODO add toggle for receive in UI?
        this.shouldToggleReceiveWithSend = n.info.shouldToggleReceiveWithSend;
        this.isLiveViewActive = n.uiSettings.isLiveViewActive;
        this.brightnessControl.setValue(n.state.brightness, { emitEvent: false });

        // TODO some way to keep track of which requests were returned by which function calls?
        this.processingStatus = {};

        // update backend with current setting (no json api setting for this)
        if (isOnChanged) {
          this.webSocketService.sendMessage({ lv: this.isLiveViewActive });
        }

        this.changeDetectorRef.markForCheck();
      });

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

  onResize() {
    const appWidth = document.documentElement.clientWidth;
    this.showBrightnessSlider = appWidth >= MIN_SHOW_BRIGHTNESS_SLIDER_THRESHOLD_PX;
    this.showPcModeButton = appWidth >= MIN_SHOW_PC_MODE_BUTTON_THRESHOLD_PX;

    // if brightness slider overlay is open & app width changed from under brightness slider threshold to over, then force close the overlay
    if (this.isBrightnessOpen && this.showBrightnessSlider) {
      this.isBrightnessOpen = false;
    }
  }

  toggleBrightnessOpen() {
    this.isBrightnessOpen = !this.isBrightnessOpen;
  }

  getOverlayPositions() {
    const OFFSET_X_PX = 0;
    const OFFSET_Y_PX = 12;
    const originCentered: OriginConnectionPosition = {
      originX: 'center',
      originY: 'bottom',
    };
    const overlayCentered: OverlayConnectionPosition = {
      overlayX: 'center',
      overlayY: 'top',
    };
    const originRightSide: OriginConnectionPosition = {
      originX: 'end',
      originY: 'bottom',
    };
    const overlayRightSide: OverlayConnectionPosition = {
      overlayX: 'end',
      overlayY: 'top',
    };
    const centeredPosition = new ConnectionPositionPair(originCentered, overlayCentered, OFFSET_X_PX, OFFSET_Y_PX);
    const rightSidePosition = new ConnectionPositionPair(originRightSide, overlayRightSide, OFFSET_X_PX, OFFSET_Y_PX);
    return [centeredPosition, rightSidePosition];
  }

  getProcessingStatus(name: string) {
    return !!this.processingStatus[name];
  }

  private setProcessingStatus(name: string, status: boolean) {
    this.processingStatus[name] = status;
  }

  private getButtons() {
    const buttons: MenuBarButton[] = [
      {
        name: TopMenuBarButtonName.POWER,
        icon: '&#xe08f;',
        onClick: () => this.togglePower(),
        enabled: () => this.isOn,
      },
      {
        name: TopMenuBarButtonName.TIMER,
        icon: '&#xe2a2;',
        onClick: () => this.toggleNightLight(),
        enabled: () => this.isNightLightActive,
      },
      {
        name: TopMenuBarButtonName.SYNC,
        icon: '&#xe116;',
        onClick: () => this.toggleSync(),
        enabled: () => this.shouldSync,
      },
      {
        name: TopMenuBarButtonName.LIVE,
        icon: '&#xe410;',
        onClick: () => this.toggleLiveView(),
        enabled: () => this.isLiveViewActive,
      },
      // TODO combine these & move to bottom menu
      /*{
        name: 'Info',
        icon: '&#xe066;',
        onClick: () => this.toggleShowInfo(),
      },
      {
        name: 'Nodes',
        icon: '&#xe22d;',
        onClick: () => this.toggleShowNodes(),
      },*/
    ];
    if (this.showPcModeButton) {
      buttons.push({
        name: 'PC Mode',
        icon: '&#xe23d;',
        onClick: () => this.togglePcMode(true),
        enabled: () => this.isPcMode,
      });
    }
    return buttons;
  }

  private togglePower() {
    if (!this.getProcessingStatus(TopMenuBarButtonName.POWER)) {
      this.setProcessingStatus(TopMenuBarButtonName.POWER, true);
      this.topMenuBarService.togglePower(!this.isOn)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(genericPostResponse(this.appStateService));
    }
  }

  private toggleNightLight() {
    if (!this.getProcessingStatus(TopMenuBarButtonName.POWER)) {
      this.setProcessingStatus(TopMenuBarButtonName.TIMER, true);
      this.topMenuBarService.toggleNightLight(!this.isNightLightActive)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response: WledApiResponse) => {
          genericPostResponse(this.appStateService)(response);
          const message = this.isNightLightActive
            ? `Timer active. Your light will turn ${this.nightLightTar > 0 ? 'on' : 'off'} ${this.nightLightMode ? 'over' : 'after'} ${this.nightLightDuration} minutes.`
            : 'Timer deactivated.'
          // showToast(message); // TODO show toast
        });
    }
  }

  private toggleSync() {
    if (!this.getProcessingStatus(TopMenuBarButtonName.POWER)) {
      this.setProcessingStatus(TopMenuBarButtonName.SYNC, true);
      this.topMenuBarService.toggleSync(!this.shouldSync, this.shouldToggleReceiveWithSend)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response: WledApiResponse) => {
          genericPostResponse(this.appStateService)(response);
          const message = this.shouldSync
            ? 'Other lights in the network will now sync to this one.'
            : 'This light and other lights in the network will no longer sync.';
          // showToast(message); // TODO show toast
        });
    }
  }

  private toggleLiveView() {
    if (!this.getProcessingStatus(TopMenuBarButtonName.POWER)) {
      this.setProcessingStatus(TopMenuBarButtonName.LIVE, true);
      this.topMenuBarService.toggleIsLiveViewActive(!this.isLiveViewActive);
    }
    
    // TODO call size() (maybe not needed?)
    // this.size();
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
        // TODO show toast
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

  private togglePcMode(fromB = false) { // TODO "from b" seems to be "called from button"
    if (fromB) {
      this.pcModeA = !this.pcModeA;
      this.isPcMode = this.pcModeA;

      // TODO save app config in local storage
      // this.localStorageService.set('pcm', this.pcModeA);
    }

    // TODO if app width is small & pc mode is off, don't toggle
    /*if (this.appWidth < 1250 && !this.isPcMode) {
      return;
    }//*/

    // TODO if not from button & app width hasn't crossed small/large threshold, don't toggle
    /*if (!fromB && ((this.appWidth < 1250 && this.lastw < 1250) || (this.appWidth >= 1250 && this.lastw >= 1250))) {
      return;
    }//*/
    // this.openTab(0, true);

    // TODO if app width is small, force non pc mode
    /*if (this.appWidth < 1250) {
      this.isPcMode = false;
    }
    else if (this.pcModeA && !fromB) {
      // TODO what is pc mode "A"?
      this.isPcMode = this.pcModeA;
    }//*/

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
    
    // TODO save current app width
    // this.lastw = this.appWidth;
  }

  private createFormControl() {
    const control = this.formBuilder.control(DEFAULT_BRIGHTNESS);
    control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((brightness: number) => this.setBrightness(brightness));
    return control;
  }

  private setBrightness(brightness: number) {
    this.topMenuBarService.setBrightness(brightness)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(genericPostResponse(this.appStateService));
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
