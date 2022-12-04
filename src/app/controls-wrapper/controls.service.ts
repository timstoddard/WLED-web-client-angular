import { Injectable } from '@angular/core';
import { AppStateService } from '../shared/app-state/app-state.service';
import { UnsubscriberService } from '../shared/unsubscriber/unsubscriber.service';
import { WebSocketService } from '../shared/web-socket.service';

@Injectable()
export class ControlsService extends UnsubscriberService {
  constructor(
    private webSocketService: WebSocketService,
    private appStateService: AppStateService,
  ) {
    super();
    this.subscribeToAppStateChanges();
  }

  private subscribeToAppStateChanges() {
    this.handleUnsubscribe(this.webSocketService.getStateInfoSocket())
      .subscribe(response => {
        this.appStateService.setAll(response);
      });
  }
}
