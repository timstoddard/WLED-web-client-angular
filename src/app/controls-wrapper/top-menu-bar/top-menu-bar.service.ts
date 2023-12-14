import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WLEDApiResponse } from '../../shared/api-types/api-types';
import { ApiService } from '../../shared/api-service/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { WebSocketService } from '../../shared/web-socket.service';

export class TopMenuBarButtonName {
  static readonly POWER = 'Power';
  static readonly NIGHTLIGHT = 'Nightlight';
  static readonly SYNC = 'Sync';
  static readonly LIVE = 'Live';
  static readonly PC_MODE = 'PC Mode';
}

@Injectable()
export class TopMenuBarService extends UnsubscriberService {
  private processingStatus!: { [key: string]: boolean };

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
    private webSocketService: WebSocketService,
  ) {
    super();
    this.processingStatus = {};
  }

  getProcessingStatus(name: string) {
    return !!this.processingStatus[name];
  }

  setProcessingStatus(name: string, status: boolean) {
    this.processingStatus[name] = status;
  }

  setPower(isOn: boolean) {
    this.processToggle(
      TopMenuBarButtonName.POWER,
      this.apiService.appState.power.set(isOn),
    );
  }

  setNightLight(isNightLightActive: boolean) {
    this.processToggle(
      TopMenuBarButtonName.NIGHTLIGHT,
      this.apiService.appState.nightLight.set(isNightLightActive),
    );
  }

  setSync(shouldSync: boolean, shouldToggleReceiveWithSend: boolean) {
    this.processToggle(
      TopMenuBarButtonName.SYNC,
      this.apiService.appState.sync.set(shouldSync, shouldToggleReceiveWithSend),
    );
  }

  setLiveView(isLiveViewActive: boolean) {
    this.appStateService.setLocalSettings({ isLiveViewActive });

    // toggle live mode on/off (no json api setting for this)
    this.webSocketService.sendMessage({ lv: isLiveViewActive });
  }

  setPcMode(isPcMode: boolean) {
    this.appStateService.setLocalSettings({ isPcMode });
  }

  setBrightness(brightness: number) {
    this.handleUnsubscribe(this.apiService.appState.brightness.set(brightness))
      .subscribe();
  }

  setTransitionDuration(seconds: number) {
    this.handleUnsubscribe(this.apiService.appState.transitionDuration.set(seconds))
      .subscribe();
  }

  private processToggle(
    name: string,
    apiToggle: Observable<WLEDApiResponse>,
  ) {
    if (!this.getProcessingStatus(name)) {
      this.setProcessingStatus(name, true);

      this.handleUnsubscribe(apiToggle)
        .subscribe(() => this.setProcessingStatus(name, false));
    }
  }
}
