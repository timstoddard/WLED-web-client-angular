import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UIConfigService } from '../../shared/ui-config.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { MenuBarButton } from '../utils';
import { TopMenuBarButtonName, TopMenuBarService } from './top-menu-bar.service';
import { FormService, getFormControl } from '../../shared/form-service';
import { AppState } from '../../shared/app-types/app-types';
import { OverlayPositionService } from '../../shared/overlay-position.service';
import { InputConfig } from '../../shared/text-input/text-input.component';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { InfoComponent } from '../info/info.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

const MIN_SHOW_BRIGHTNESS_SLIDER_THRESHOLD_PX = 800;
const MIN_SHOW_PC_MODE_BUTTON_THRESHOLD_PX = 1250;

interface TopMenuBarButtonValues {
  isOn: boolean;
  isNightLightActive: boolean;
  isSyncActive: boolean;
  isLiveViewActive: boolean;
  isPcMode: boolean;
}

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.scss'],
  host: { '(window:resize)': 'onResize($event)' },
})
export class TopMenuBarComponent extends UnsubscriberComponent implements OnInit {
  buttons: MenuBarButton[] = [];
  topMenuBarForm!: FormGroup;
  isSettingsOverlayOpen: boolean = false;
  showToggleSettingsButton: boolean = false;
  showPcModeButton: boolean = false;
  showLabels!: boolean;
  transitionInput: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.topMenuBarForm, 'transitionTime'),
    placeholder: '0.5',
    widthPx: 60,
    min: 0,
    max: 65.5,
    step: 0.1,
  };

  buttonValues: TopMenuBarButtonValues = {
    isOn: false,
    isNightLightActive: false,
    isSyncActive: false,
    isLiveViewActive: false,
    isPcMode: false,
  };

  // extra config, configured through settings
  private nightLightDuration = 60;
  private nightLightTargetBrightness = 0;
  private nightLightMode = false;
  private shouldToggleReceiveWithSend = true;
  private infoDialogRef: MatDialogRef<InfoComponent> | null = null;

  constructor(
    private formService: FormService,
    private topMenuBarService: TopMenuBarService,
    private appStateService: AppStateService,
    private changeDetectorRef: ChangeDetectorRef,
    private uiConfigService: UIConfigService,
    private overlayPositionService: OverlayPositionService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
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
        this.showLabels = uiConfig.showLabels;
      });
  }

  getProcessingStatus(name: string) {
    return this.topMenuBarService.getProcessingStatus(name);
  }

  onResize() {
    const appWidth = document.documentElement.clientWidth;
    this.showToggleSettingsButton = appWidth < MIN_SHOW_BRIGHTNESS_SLIDER_THRESHOLD_PX;
    const previousShowPcModeButton = this.showPcModeButton;
    this.showPcModeButton = appWidth >= MIN_SHOW_PC_MODE_BUTTON_THRESHOLD_PX;
    if (this.showPcModeButton != previousShowPcModeButton) {
      // if viewport width transitioning across pc mode threshold, auto toggle pc mode
      this.topMenuBarService.setPcMode(this.showPcModeButton);
    }
    this.buttons = this.getButtons();

    // if settings overlay is open & app width changed from under brightness slider threshold to over, then force close the overlay
    if (this.isSettingsOverlayOpen && this.showToggleSettingsButton) {
      this.isSettingsOverlayOpen = false;
    }

    this.closeInfoOverlay();
  }

  toggleSettingsOpen() {
    this.isSettingsOverlayOpen = !this.isSettingsOverlayOpen;
  }

  openInfoOverlay() {
    this.infoDialogRef = this.dialog.open(InfoComponent);
  }

  closeInfoOverlay() {
    if (this.infoDialogRef) {
      this.infoDialogRef.close();
    }
    this.infoDialogRef = null;
  }

  getSettingsOverlayPositions() {
    const offsetXPx = 0;
    const offsetYPx = 4;
    const centerPosition = this.overlayPositionService.centerBottomPosition(offsetXPx, offsetYPx);
    const rightPosition = this.overlayPositionService.rightBottomPosition(offsetXPx, offsetYPx);
    return [centerPosition, rightPosition];
  }

  private getButtons() {
    const buttons: MenuBarButton[] = [
      {
        name: TopMenuBarButtonName.POWER,
        icon: 'power_settings_new',
        onClick: () => this.topMenuBarService.setPower(!this.buttonValues.isOn),
        enabled: () => this.buttonValues.isOn,
      },
      {
        name: TopMenuBarButtonName.NIGHTLIGHT,
        icon: 'nightlight',
        onClick: () => this.topMenuBarService.setNightLight(!this.buttonValues.isNightLightActive),
        enabled: () => this.buttonValues.isNightLightActive,
      },
      {
        name: TopMenuBarButtonName.SYNC,
        icon: 'sync',
        onClick: () => this.topMenuBarService.setSync(!this.buttonValues.isSyncActive, this.shouldToggleReceiveWithSend),
        enabled: () => this.buttonValues.isSyncActive,
      },
      {
        name: TopMenuBarButtonName.LIVE,
        icon: 'visibility',
        onClick: () => this.topMenuBarService.setLiveView(!this.buttonValues.isLiveViewActive),
        enabled: () => this.buttonValues.isLiveViewActive,
      },
    ];

    if (this.showPcModeButton) {
      buttons.push({
        name: TopMenuBarButtonName.PC_MODE,
        icon: 'computer',
        onClick: () => this.topMenuBarService.setPcMode(!this.buttonValues.isPcMode),
        enabled: () => this.buttonValues.isPcMode,
      });
    }

    return buttons;
  }

  private handleAppStateUpdate = ({ state, info, localSettings }: AppState) => {
    // power
    this.buttonValues.isOn = state.on;

    // nightlight
    let oldIsNightLightActive = this.buttonValues.isNightLightActive;
    this.buttonValues.isNightLightActive = state.nightLight.on;
    if (this.buttonValues.isNightLightActive !== oldIsNightLightActive) {
      this.handleNightLightChange();
    }

    // sync
    let oldIsSyncActive = this.buttonValues.isSyncActive;
    this.buttonValues.isSyncActive = state.udp.shouldSend;
    if (this.buttonValues.isSyncActive !== oldIsSyncActive) {
      this.handleSyncChange();
    }
    this.shouldToggleReceiveWithSend = info.shouldToggleReceiveWithSend;

    // local settings
    this.buttonValues.isLiveViewActive = localSettings.isLiveViewActive;
    this.buttonValues.isPcMode = localSettings.isPcMode;

    // brightness
    this.topMenuBarForm.get('brightness')!
      .setValue(state.brightness, { emitEvent: false });

    // transition time
    this.topMenuBarForm.get('transitionTime')!
      .setValue(state.transition, { emitEvent: false });

    this.changeDetectorRef.markForCheck();
  }

  private handleNightLightChange() {
    const message = this.buttonValues.isNightLightActive
      ? `Nightlight active. Your light will turn ${this.nightLightTargetBrightness > 0 ? 'on over' : 'off after'} ${this.nightLightDuration} minutes.`
      : 'Nightlight deactivated.';
    this.snackbarService.openSnackBar(message);
  }

  private handleSyncChange() {
    const message = this.buttonValues.isSyncActive
      ? 'Other lights in the network will now sync to this one.'
      : 'This light and other lights in the network will no longer sync.';
    this.snackbarService.openSnackBar(message);
  }

  private createForm() {
    const form = this.formService.createFormGroup({
      brightness: 0,
    }, {
      // TODO on blur, animate the form input to indicate a successful (or unsuccessful) backend update
      transitionTime: this.formService.createFormControl(0, 'blur'),
    });

    this.getValueChanges<number>(form, 'brightness')
      .subscribe((brightness: number) => this.topMenuBarService.setBrightness(brightness));

    this.getValueChanges<number>(form, 'transitionTime')
      .subscribe((seconds: number) => this.topMenuBarService.setTransitionDuration(seconds));

    return form;
  }
}
