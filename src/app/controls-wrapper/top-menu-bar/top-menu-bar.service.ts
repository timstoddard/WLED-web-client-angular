import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WledApiResponse } from '../../shared/api-types';
import { ApiService } from '../../shared/api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { PostResponseHandler } from '../../shared/post-response-handler';
import { UnsubscriberService } from '../../shared/unsubscribing/unsubscriber.service';
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
    private postResponseHandler: PostResponseHandler,
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

  togglePower(isOn: boolean) {
    this.processToggle(
      TopMenuBarButtonName.POWER,
      this.apiService.togglePower(isOn),
    );
  }

  toggleNightLight(isNightLightActive: boolean) {
    this.processToggle(
      TopMenuBarButtonName.TIMER,
      this.apiService.toggleNightLight(isNightLightActive),
    );
  }

  toggleSync(shouldSync: boolean, shouldToggleReceiveWithSend: boolean) {
    this.processToggle(
      TopMenuBarButtonName.SYNC,
      this.apiService.toggleSync(shouldSync, shouldToggleReceiveWithSend),
    );
  }

  toggleLiveView(isLiveViewActive: boolean) {
    this.appStateService.setIsLiveViewActive(isLiveViewActive);

    // TODO this was moved from the component's app state subscription, make sure it doesn't cause any bugs by being here
    // update backend with current setting (no json api setting for this)
    this.webSocketService.sendMessage({ lv: isLiveViewActive });
  }

  setBrightness(brightness: number) {
    this.handleUnsubscribe(this.apiService.setBrightness(brightness))
      .subscribe(this.postResponseHandler.handleFullJsonResponse());
  }

  setTransitionDuration(seconds: number) {
    this.handleUnsubscribe(this.apiService.setTransitionDuration(seconds))
      .subscribe(this.postResponseHandler.handleStateResponse());
  }

  private processToggle(
    name: string,
    apiToggle: Observable<WledApiResponse>,
  ) {
    if (!this.getProcessingStatus(name)) {
      this.setProcessingStatus(name, true);
      const subscriber = this.postResponseHandler
        .handleFullJsonResponse(() => this.setProcessingStatus(name, false));
      this.handleUnsubscribe(apiToggle)
        .subscribe(subscriber);
    }
  }
}
