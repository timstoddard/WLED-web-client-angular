import { OriginConnectionPosition, OverlayConnectionPosition, ConnectionPositionPair } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UIConfigService } from '../../shared/ui-config.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UnsubscriberComponent } from '../../shared/unsubscribing/unsubscriber.component';
import { generateApiUrl } from '../json.service';
import { MenuBarButton, setCssColor } from '../utils';
import { TopMenuBarButtonName, TopMenuBarService } from './top-menu-bar.service';
import { FormService } from '../../shared/form-service';
import { AppStateProps } from '../../shared/app-types';

const DEFAULT_BRIGHTNESS = 128;
const DEFAULT_TRANSITION_DURATION_SECONDS = 0.7;
const MIN_SHOW_BRIGHTNESS_SLIDER_THRESHOLD_PX = 800;
const MIN_SHOW_PC_MODE_BUTTON_THRESHOLD_PX = 1200; // TODO might need to be bigger

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.scss'],
  host: { '(window:resize)': 'onResize($event)' },
})
export class TopMenuBarComponent extends UnsubscriberComponent implements OnInit {
  buttons: MenuBarButton[] = [];
  topMenuBarForm!: FormGroup;
  isSettingsOpen: boolean = false;
  showToggleSettingsButton: boolean = false;
  showPcModeButton: boolean = false;
  isDarkMode!: boolean;
  showLabels!: boolean;

  // TODO convert to object/array
  // button controls
  private isOn = false;
  private isNightLightActive = false;
  private nightLightDuration = 60;
  private nightLightTar = 0; // TODO better name
  private nightLightMode = false;
  private isSyncActive = false;
  private shouldToggleReceiveWithSend = true;
  isLiveViewActive = false;
  private showInfo = false;
  private showNodes = false;

  // other vars (some are for sliding ui)
  private appWidth: number = 0;
  private isPcMode = false;
  private pcModeA = false;
  private x0 = null;
  private lastw = 0;
  private locked = false;
  private scrollS = 0;
  private N = 4;

  constructor(
    private formService: FormService,
    private localStorageService: LocalStorageService,
    private topMenuBarService: TopMenuBarService,
    private appStateService: AppStateService,
    private changeDetectorRef: ChangeDetectorRef,
    private uiConfigService: UIConfigService,
  ) {
    super();
  }

  ngOnInit() {
    this.buttons = this.getButtons();
    this.topMenuBarForm = this.createForm();
    this.onResize();

    this.appStateService.getAppState(this.ngUnsubscribe)
      .subscribe(this.handleAppStateUpdate);

    this.uiConfigService.getUIConfig(this.ngUnsubscribe)
      .subscribe((uiConfig) => {
        this.isDarkMode = uiConfig.theme.base === 'dark';
        this.showLabels = uiConfig.showLabels;
      });

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

  getProcessingStatus(name: string) {
    return this.topMenuBarService.getProcessingStatus(name);
  }

  // TODO evaluate if needed
  onResize() {
    const appWidth = document.documentElement.clientWidth;
    this.showToggleSettingsButton = appWidth >= MIN_SHOW_BRIGHTNESS_SLIDER_THRESHOLD_PX;
    this.showPcModeButton = appWidth >= MIN_SHOW_PC_MODE_BUTTON_THRESHOLD_PX;

    // if settings overlay is open & app width changed from under brightness slider threshold to over, then force close the overlay
    if (this.isSettingsOpen && this.showToggleSettingsButton) {
      this.isSettingsOpen = false;
    }
  }

  toggleSettingsOpen() {
    this.isSettingsOpen = !this.isSettingsOpen;
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

  /**
   * Toggles between light and dark mode.
   * @param config 
   */
  toggleTheme() {
    const newBase = this.isDarkMode ? 'light' : 'dark';
    this.uiConfigService.setThemeBase(newBase);
  }

  private getButtons() {
    const buttons: MenuBarButton[] = [
      {
        name: TopMenuBarButtonName.POWER,
        icon: 'power_settings_new',
        onClick: () => this.topMenuBarService.togglePower(!this.isOn),
        enabled: () => this.isOn,
      },
      {
        name: TopMenuBarButtonName.TIMER,
        icon: 'timer',
        onClick: () => this.topMenuBarService.toggleNightLight(!this.isNightLightActive),
        enabled: () => this.isNightLightActive,
      },
      {
        name: TopMenuBarButtonName.SYNC,
        icon: 'sync',
        onClick: () => this.topMenuBarService.toggleSync(!this.isSyncActive, this.shouldToggleReceiveWithSend),
        enabled: () => this.isSyncActive,
      },
      {
        name: TopMenuBarButtonName.LIVE,
        icon: 'visibility',
        onClick: () => this.topMenuBarService.toggleLiveView(!this.isLiveViewActive),
        enabled: () => this.isLiveViewActive,
      },
      // TODO combine these & move to bottom menu
      /*{
        name: 'Info',
        icon: 'info',
        onClick: () => this.toggleShowInfo(),
      },
      {
        name: 'Nodes',
        icon: 'lan',
        onClick: () => this.toggleShowNodes(),
      },*/
    ];
    if (this.showPcModeButton) {
      buttons.push({
        name: 'PC Mode',
        icon: 'computer',
        onClick: () => this.togglePcMode(true),
        enabled: () => this.isPcMode,
      });
    }
    return buttons;
  }

  private handleAppStateUpdate = ({ state, info, localSettings }: AppStateProps) => {
    // power
    this.isOn = state.on;

    // timer/nightlight
    let oldIsNightLightActive = this.isNightLightActive;
    this.isNightLightActive = state.nightLight.on;
    if (this.isNightLightActive !== oldIsNightLightActive) {
      this.handleNightLightChange();
    }

    // sync
    let oldIsSyncActive = this.isSyncActive;
    this.isSyncActive = state.udp.shouldSend;
    if (this.isSyncActive !== oldIsSyncActive) {
      this.handleSyncChange();
    }
    // TODO add toggle button for receive in UI?
    this.shouldToggleReceiveWithSend = info.shouldToggleReceiveWithSend;

    // live view
    this.isLiveViewActive = localSettings.isLiveViewActive;

    // brightness
    this.topMenuBarForm.get('brightness')!
      .setValue(state.brightness, { emitEvent: false });

    // transition time
    this.topMenuBarForm.get('transitionTime')!
      .setValue(state.transition, { emitEvent: false });

    this.changeDetectorRef.markForCheck();
  }

  private handleNightLightChange() {
    const message = this.isNightLightActive
      ? `Timer active. Your light will turn ${this.nightLightTar > 0 ? 'on' : 'off'} ${this.nightLightMode ? 'over' : 'after'} ${this.nightLightDuration} minutes.`
      : 'Timer deactivated.';
    // TODO show toast
    const showToast = (s: string) => alert(s);
    showToast(message);
  }

  private handleSyncChange() {
    const message = this.isSyncActive
      ? 'Other lights in the network will now sync to this one.'
      : 'This light and other lights in the network will no longer sync.';
    // TODO show toast
    const showToast = (s: string) => alert(s);
    showToast(message);
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

  private createForm() {
    const form = this.formService.createFormGroup({
      brightness: DEFAULT_BRIGHTNESS,
    }, {
      transitionTime: this.formService.createFormControl(DEFAULT_TRANSITION_DURATION_SECONDS, 'blur'),
    });

    this.getValueChanges<number>(form, 'brightness')
      .subscribe((brightness: number) => this.topMenuBarService.setBrightness(brightness));
    this.getValueChanges<number>(form, 'transitionTime')
      .subscribe((seconds: number) => this.topMenuBarService.setTransitionDuration(seconds));

    return form;
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
