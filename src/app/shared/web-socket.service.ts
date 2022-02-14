import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private messagesSubject$ = new Subject<any>();
  messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));
  private socket$!: WebSocketSubject<any>;

  constructor(private apiService: ApiService) {
    this.connect();
  }

  connect() {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getWebSocket();
      const messages = this.socket$.pipe(
        tap({
          error: error => console.log(error),
        }), catchError(_ => EMPTY));
      this.messagesSubject$.next(messages);
    }
  }

  getWebSocket() {
    return webSocket(this.getWebSocketUrl());
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  close() {
    this.socket$.complete();
  }

  private getWebSocketUrl() {
    const apiUrl = this.apiService.BASE_URL;
    return `ws://${apiUrl}/ws`;
  }
}
