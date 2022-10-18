import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { WledApiResponse } from './api-types';
import { AppStateService } from './app-state/app-state.service';
import { LiveViewData } from './live-view/live-view.service';
import { OnlineStatusService } from './online-status.service';
import { UnsubscriberService } from './unsubscribing/unsubscriber.service';

// TODO how are these used by the web socket?
const LIVE_VIEW_MESSAGE = 'LIVE_VIEW_MESSAGE';
const STATE_AND_INFO_MESSAGE = 'STATE_AND_INFO_MESSAGE';

@Injectable({ providedIn: 'root' })
export class WebSocketService extends UnsubscriberService {
  private socket$!: WebSocketSubject<any>;
  private stateAndInfoSocket$!: Observable<WledApiResponse>;
  private liveViewSocket$!: Observable<LiveViewData>;

  constructor(
    private onlineStatusService: OnlineStatusService,
    private appStateService: AppStateService,
  ) {
    super();
    this.init();
  }

  private init() {
    this.appStateService.getSelectedWledIpAddress(this.ngUnsubscribe)
      .subscribe(({ ipv4Address }) => {
        if (this.onlineStatusService.getIsOffline()) {
          this.fakeConnect();
        } else {
          this.connect(ipv4Address);
          // TODO after connecting, send ws message about live view (to force enable/disable)
        }
      });
  }

  getStateInfoSocket() {
    return this.stateAndInfoSocket$;
  }

  getLiveViewSocket() {
    return this.liveViewSocket$;
  }

  sendMessage(msg: { [key: string]: unknown }) {
    this.socket$.next(msg);
  }

  close() {
    this.socket$.complete();
  }

  private connect(apiBaseUrl: string) {
    // TODO handle dropped connections
    // https://javascript-conference.com/blog/real-time-in-angular-a-journey-into-websocket-and-rxjs/

    this.socket$ = webSocket<any /* TODO type */>(this.getWebSocketUrl(apiBaseUrl));

    this.stateAndInfoSocket$ = this.socket$.multiplex(
      () => ({ subscribe: STATE_AND_INFO_MESSAGE }),
      () => ({ unsubscribe: STATE_AND_INFO_MESSAGE }),
      message => !!message.state || !!message.info);

    this.liveViewSocket$ = this.socket$.multiplex(
      () => ({ subscribe: LIVE_VIEW_MESSAGE }),
      () => ({ unsubscribe: LIVE_VIEW_MESSAGE }),
      message => !!message.leds);
  }

  private getWebSocketUrl(apiBaseUrl: string) {
    return `ws://${apiBaseUrl}/ws`;
  }

  private fakeConnect() {
    this.socket$ = new Subject<any>() as WebSocketSubject<any>;
    this.stateAndInfoSocket$ = new Observable<any>();
    this.liveViewSocket$ = new Observable<any>();
  }
}
