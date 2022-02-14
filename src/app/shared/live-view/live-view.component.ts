import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../api.service';
import { WebSocketService } from '../web-socket.service';
// import { AppStateService } from '../app-state/app-state.service';
import { UnsubscribingComponent } from '../unsubscribing.component';
import { generateApiUrl } from '../../controls-wrapper/json.service';
import { DomSanitizer } from '@angular/platform-browser';
export const WS_ENDPOINT = ''; // environment.wsEndpoint;

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent extends UnsubscribingComponent implements OnInit {
  @ViewChild('liveView') liveViewCanvas!: ElementRef<HTMLCanvasElement>;
  isLive: boolean = true;
  private hasWebSocket: boolean = false; // TODO how to figure this out?
  private updateTimeout: number = 0;
  private backgroundString: string = '';

  constructor(
    // private appStateService: AppStateService,
    private apiService: ApiService,
    private webSocketService: WebSocketService,
    private sanitizer: DomSanitizer,
  ) {
    super();
  }

  ngOnInit() {
    if (this.hasWebSocket) {
      this.updateWithWebSocket();
    } else {
      this.update();
    }

    // this.appStateService.getIsLive(this.ngUnsubscribe)
    //   .subscribe((isLive: boolean) => {
    //     this.isLive = isLive;
    //   });
  }

  getIframeUrl() {
    const url = this.isLive
      ? generateApiUrl('liveview')
      : 'about:blank';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getIframeStyle() {
    return { background: this.backgroundString };
  }

  /**
   * Updates canvas to show live LED view. Does not use web sockets.
   */
  private update() {
    // TODO what use case is this for?
    // if (document.hidden) {
    //   clearTimeout(this.updateTimeout);
    //   this.updateTimeout = setTimeout(this.update, 250) as unknown as number;
    //   return;
    // }

    // TODO is there a way to set interval in rxjs
    this.apiService.getLiveData()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((n) => {
        try {
          this.backgroundString = this.updateLiveData(n);
        } catch (e) {
        } finally {
          const LIVE_VIEW_FPS = 10; // TODO add setting in UI
          clearTimeout(this.updateTimeout);
          this.updateTimeout = setTimeout(() => this.update(), 1000 / LIVE_VIEW_FPS) as unknown as number;
        }
      });
  }

  private updateLiveData(json: any) {
    console.log(json);
    // TODO
    // this logic was written to fill the background of a div, need to translate it to work with a canvas
    const len = json.leds.length;
    let str = "linear-gradient(90deg,";
    for (let i = 0; i < len; i++) {
      let leddata = json.leds[i];
      if (leddata.length > 6)
        leddata = leddata.substring(2);
      str += "#" + leddata;
      if (i < len - 1)
        str += ","
    }
    str += ")";
    // this.liveViewCanvas.nativeElement.style.background = str;
    return str;
  }

  /**
   * Updates canvas to show live LED view. Uses web sockets.
   */
  private updateWithWebSocket() {
    // TODO create web socket service
    console.log('ws')

    const ws = this.webSocketService.getWebSocket();
    ws.subscribe(n => console.log('ws', n))

    // // onConnection(WebSocket);
    // WebSocket.on('message', (message: any) => {
    //   // onMessage(message, WebSocket);
    //   console.log(message)
    // });
    // WebSocket.on('error', (error: any) => {
    //   // OnError(error);
    //   console.warn(error)
    // });
    // WebSocket.on('close', (ws: any) => {
    //   // onClose();
    //   console.log(ws)
    // });

    // TODO rewrite this so it works
    // const ws = top.window.ws;
    // if (ws && ws.readyState === WebSocket.OPEN) {
    //   console.info("Use top WS for peek");
    //   ws.send("{'lv':true}");
    // } else {
    //   console.info("Peek ws opening");
    //   ws = new WebSocket("ws://" + document.location.host + "/ws");
    //   ws.onopen = () => {
    //     console.info("Peek WS opened");
    //     ws.send("{'lv':true}");
    //   }
    // }
    // ws.addEventListener('message', this.getLiveJson);
  }

  private socket$!: WebSocketSubject<any>;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$
    .pipe(
      switchAll(),
      catchError(e => { throw e }));

  public connect(): void {

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(
        tap({
          error: error => console.log(error),
        }), catchError(_ => EMPTY));
      this.messagesSubject$.next(messages);
    }
  }

  private getNewWebSocket() {
    return webSocket(WS_ENDPOINT);
  }
  sendMessage(msg: any) {
    this.socket$.next(msg);
  }
  close() {
    this.socket$.complete();
  }

  private getLiveJson(event: any) {
    try {
      const json = JSON.parse(event.data);
      if (json && json.leds) {
        requestAnimationFrame(() => this.updatePreview(json.leds));
      }
    }
    catch (err) {
      console.error("Live-Preview ws error:", err);
    }
  }

  private updatePreview(leds: any[]) {
    const len = leds.length;
    let str = "linear-gradient(90deg,";
    for (let i = 0; i < len; i++) {
      let leddata = leds[i];
      if (leddata.length > 6) leddata = leddata.substring(2);
      str += "#" + leddata;
      if (i < len - 1) str += ","
    }
    str += ")";
    this.liveViewCanvas.nativeElement.style.background = str;
  }
}
