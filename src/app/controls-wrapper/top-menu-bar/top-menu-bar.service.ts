import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WLEDApiResponse } from '../../shared/api-types/api-types';
import { ApiService } from '../../shared/api-service/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { ApiResponseHandler } from '../../shared/api-response-handler';
import { UnsubscriberService } from '../../shared/unsubscriber/unsubscriber.service';
import { WebSocketService } from '../../shared/web-socket.service';

export class TopMenuBarButtonName {
  static readonly POWER = 'Power';
  static readonly TIMER = 'Timer'; // TODO rename references to nightlight to timer
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
    private apiResponseHandler: ApiResponseHandler,
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
      TopMenuBarButtonName.TIMER,
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

    // TODO this was moved from the component's app state subscription, make sure it doesn't cause any bugs by being here
    // update backend with current setting (no json api setting for this)
    this.webSocketService.sendMessage({ lv: isLiveViewActive });
  }

  setBrightness(brightness: number) {
    this.handleUnsubscribe(this.apiService.appState.brightness.set(brightness))
      .subscribe(this.apiResponseHandler.handleFullJsonResponse());
  }

  setTransitionDuration(seconds: number) {
    this.handleUnsubscribe(this.apiService.appState.transitionDuration.set(seconds))
      .subscribe(this.apiResponseHandler.handleStateResponse());
  }

  private processToggle(
    name: string,
    apiToggle: Observable<WLEDApiResponse>,
  ) {
    if (!this.getProcessingStatus(name)) {
      this.setProcessingStatus(name, true);
      const subscriber = this.apiResponseHandler
        .handleFullJsonResponse(() => this.setProcessingStatus(name, false));
      this.handleUnsubscribe(apiToggle)
        .subscribe(subscriber);
    }
  }
}
