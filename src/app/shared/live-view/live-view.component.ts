import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { WebSocketService } from '../web-socket.service';
import { AppStateService } from '../app-state/app-state.service';
import { UnsubscribingComponent } from '../unsubscribing/unsubscribing.component';
import { generateApiUrl } from '../../controls-wrapper/json.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LiveViewService } from './live-view.service';
import { interval } from 'rxjs';

// TODO better change detection (?) so this component doesnt cause perf issues

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss'],
  providers: [LiveViewService],
})
export class LiveViewComponent extends UnsubscribingComponent implements OnInit {
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
    this.appStateService.getIsLiveViewActive(this.ngUnsubscribe)
      .subscribe(isLiveViewActive => {
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
  private update() {
    // TODO what use case is this for?
    // if (document.hidden) {
    //   clearTimeout(this.updateTimeout);
    //   this.updateTimeout = setTimeout(this.update, 250) as unknown as number;
    //   return;
    // }

    this.handleUnsubscribe(
      this.apiService.getLiveData())
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
    // this.handleUnsubscribe(interval(timeoutMs))
    //   .subscribe(() => { this.update(); });
  }

  /**
   * Updates canvas to show live LED view. Uses web sockets.
   */
  private updateWithWebSocket() {
    this.handleUnsubscribe(
      this.webSocketService.getLiveViewSocket())
      .subscribe(({ leds }) => {
        this.backgroundString = this.liveViewService.getBackgroundString(leds);
        this.changeDetectorRef.markForCheck();
      });

    const LIVE_VIEW_API_FPS = 1; // 5; // TODO add setting in UI
    const timeoutMs = 1000 / LIVE_VIEW_API_FPS;
    // TODO this works without interval??
    // this.handleUnsubscribe(interval(timeoutMs))
    //   .subscribe(() => { this.updateWithWebSocket(); });
  }

  // TODO do we need to request animation frame?
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
