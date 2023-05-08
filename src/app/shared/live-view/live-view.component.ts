import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { WebSocketService } from '../web-socket.service';
import { AppStateService } from '../app-state/app-state.service';
import { UnsubscriberComponent } from '../unsubscriber/unsubscriber.component';
import { DomSanitizer } from '@angular/platform-browser';
import { LiveViewService } from './live-view.service';
import { timer } from 'rxjs';

// TODO better change detection (?) so this component doesnt cause perf issues

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss'],
  providers: [LiveViewService],
})
export class LiveViewComponent extends UnsubscriberComponent implements OnInit {
  @ViewChild('liveView') liveViewCanvas!: ElementRef<HTMLCanvasElement>;
  isLive: boolean = true;
  private updateTimeout!: number;
  private backgroundString: string = '';

  constructor(
    private appStateService: AppStateService,
    private apiService: ApiService,
    private webSocketService: WebSocketService,
    private sanitizer: DomSanitizer,
    private liveViewService: LiveViewService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.appStateService.getLocalSettings(this.ngUnsubscribe)
      .subscribe(({ isLiveViewActive }) => {
        if (isLiveViewActive) {
          try {
            this.updateWithWebSocket();
          } catch (e) {
            this.update();
          }
        } else {
          // TODO disable update() calls
        }
      });
  }

  getIframeUrl() {
    // TODO what url to use here?
    // const url = this.isLive
    //   ? `${this.apiService.BASE_URL}/liveview`
    //   : 'about:blank';
    const url = '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getIframeStyle() {
    return { background: this.backgroundString };
  }

  /**
   * Updates canvas to show live LED view. Does not use web sockets.
   */
  private update = () => {
    // TODO the api endpoint for this doesn't seem to work anymore
    this.handleUnsubscribe(
      this.apiService.appState.liveData.get())
      .subscribe(({ leds }) => {
        try {
          this.backgroundString = this.liveViewService.getBackgroundString(leds);
          this.changeDetectorRef.markForCheck();
        } catch (e) {
        }
      });

    const LIVE_VIEW_WS_FPS = 1; // 10; // TODO add setting in UI
    const timeoutMs = 1000 / LIVE_VIEW_WS_FPS;
    // TODO this works without interval??
    this.handleUnsubscribe(timer(timeoutMs))
      .subscribe(this.update);
  }

  /**
   * Updates canvas to show live LED view. Uses web sockets.
   */
  private updateWithWebSocket() {
    this.handleUnsubscribe(
      this.webSocketService.getLiveViewSocket())
      .subscribe((arr) => {
        this.backgroundString = this.liveViewService.getBackgroundStringFromUint8Array(arr);
        this.changeDetectorRef.markForCheck();
      });
  }

  // TODO should use request animation frame?
  private getLiveJson(leds: string[]) {
    try {
      requestAnimationFrame(() => {
        this.backgroundString = this.liveViewService.getBackgroundString(leds);
      });
    } catch (e) {
      console.error('Websocket error [Live preview]:', e);
    }
  }
}
