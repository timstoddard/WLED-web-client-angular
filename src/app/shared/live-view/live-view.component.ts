import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ApiService } from '../api.service';
import { WebSocketService } from '../web-socket.service';
import { AppStateService } from '../app-state/app-state.service';
import { UnsubscribingComponent } from '../unsubscribing.component';
import { generateApiUrl } from '../../controls-wrapper/json.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LiveViewService } from './live-view.service';

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

    // TODO is there a way to set interval in rxjs
    this.apiService.getLiveData()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({ leds }) => {
        try {
          this.backgroundString = this.liveViewService.getBackgroundString(leds);
          this.changeDetectorRef.markForCheck();
        } catch (e) {
        } finally {
          const LIVE_VIEW_FPS = 5; // TODO add setting in UI
          const timeoutMs = 1000 / LIVE_VIEW_FPS;
          clearTimeout(this.updateTimeout);
          this.updateTimeout = setTimeout(() => this.update(), timeoutMs) as unknown as number;
        }
      });
  }

  /**
   * Updates canvas to show live LED view. Uses web sockets.
   */
  private updateWithWebSocket() {
    this.webSocketService.getLiveViewSocket()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({ leds }) => {
        this.backgroundString = this.liveViewService.getBackgroundString(leds);
        this.changeDetectorRef.markForCheck();
      });
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