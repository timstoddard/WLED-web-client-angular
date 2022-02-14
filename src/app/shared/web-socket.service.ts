import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ApiService } from './api.service';
import { LiveViewData } from './live-view/live-view.service';

const LIVE_VIEW_MESSAGE = 'LIVE_VIEW_MESSAGE';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;
  private liveViewSocket$!: Observable<LiveViewData>;

  constructor(private apiService: ApiService) {
    this.connect();
  }

  getLiveViewSocket() {
    return this.liveViewSocket$;
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  close() {
    this.socket$.complete();
  }

  private connect() {
    // TODO handle dropped connections
    // https://javascript-conference.com/blog/real-time-in-angular-a-journey-into-websocket-and-rxjs/

    this.socket$ = webSocket<any /* TODO type */>(this.getWebSocketUrl());

    this.liveViewSocket$ = this.socket$.multiplex(
      () => ({ subscribe: LIVE_VIEW_MESSAGE }),
      () => ({ unsubscribe: LIVE_VIEW_MESSAGE }),
      message => !!message.leds);
  }

  private getWebSocketUrl() {
    const apiUrl = this.apiService.BASE_URL;
    return `ws://${apiUrl}/ws`;
  }
}
