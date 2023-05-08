import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { WLEDApiResponse } from './api-types/api-types';
import { AppStateService } from './app-state/app-state.service';
import { OnlineStatusService } from './online-status.service';
import { UnsubscriberService } from './unsubscriber/unsubscriber.service';

// TODO how are these used by the web socket?
const LIVE_VIEW_MESSAGE = 'LIVE_VIEW_MESSAGE';
const STATE_AND_INFO_MESSAGE = 'STATE_AND_INFO_MESSAGE';

@Injectable({ providedIn: 'root' })
export class WebSocketService extends UnsubscriberService {
  private socket$!: WebSocketSubject<any>;
  private stateAndInfoSocket$!: Observable<WLEDApiResponse>;
  private liveViewSocket$!: Observable<Uint8Array>;

  constructor(
    private onlineStatusService: OnlineStatusService,
    private appStateService: AppStateService,
  ) {
    super();
    this.init();
  }

  private init() {
    this.appStateService.getLocalSettings(this.ngUnsubscribe)
      .subscribe(({ selectedWLEDIpAddress }) => {
        const { ipv4Address } = selectedWLEDIpAddress;
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

    this.socket$ = webSocket<WLEDApiResponse | Uint8Array>({
      url: this.getWebSocketUrl(apiBaseUrl),
      binaryType: 'arraybuffer',
      deserializer: (e) => {
        if (toString.call(e.data) === '[object ArrayBuffer]') {
          // response is an int array (live view data)
          const arr = new Uint8Array(e.data);
          const isValid = arr[0] === 76;
          return isValid ? arr : null;
        } else {
          // response is a stringified json object
          let dataAsText = '';
          try {
            dataAsText = e.data;
            return JSON.parse(dataAsText);
          } catch (err) {
            console.warn('failed to parse json:', dataAsText);
            console.warn(err);
          }
        }

        return null;
      },
    });

    this.stateAndInfoSocket$ = this.socket$.multiplex(
      () => ({ subscribe: STATE_AND_INFO_MESSAGE }),
      () => ({ unsubscribe: STATE_AND_INFO_MESSAGE }),
      message => !!message.state || !!message.info);

    this.liveViewSocket$ = this.socket$.multiplex(
      () => ({ subscribe: LIVE_VIEW_MESSAGE }),
      () => ({ unsubscribe: LIVE_VIEW_MESSAGE }),
      message => message instanceof Uint8Array);
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
