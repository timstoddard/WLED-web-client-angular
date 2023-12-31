import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WLEDApiResponse } from '../../shared/api-types/api-types';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { WebSocketService } from '../../shared/web-socket.service';
import { StateApiService } from 'src/app/shared/api-service/state-api.service';

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
    private stateApiService: StateApiService,
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
      this.stateApiService.setPower(isOn),
    );
  }

  setNightLight(isNightLightActive: boolean) {
    this.processToggle(
      TopMenuBarButtonName.NIGHTLIGHT,
      this.stateApiService.setNightLightActive(isNightLightActive),
    );
  }

  setSync(shouldSync: boolean, shouldToggleReceiveWithSend: boolean) {
    this.processToggle(
      TopMenuBarButtonName.SYNC,
      this.stateApiService.setSync(shouldSync, shouldToggleReceiveWithSend),
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
    this.handleUnsubscribe(this.stateApiService.setBrightness(brightness))
      .subscribe();
  }

  setTransitionDuration(seconds: number) {
    this.handleUnsubscribe(this.stateApiService.setTransitionDuration(seconds))
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
