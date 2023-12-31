import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { WebSocketService } from '../web-socket.service';
import { AppStateService } from '../app-state/app-state.service';
import { UnsubscriberComponent } from '../unsubscriber/unsubscriber.component';
import { LiveViewService } from './live-view.service';
import { StateApiService } from '../api-service/state-api.service';

// TODO better change detection (?) so this component doesnt cause perf issues

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss'],
  providers: [LiveViewService],
})
export class LiveViewComponent extends UnsubscriberComponent implements OnInit {
  isLive = true;
  fps = 0;
  showFps = false;
  private backgroundString = '';

  constructor(
    private appStateService: AppStateService,
    private stateApiService: StateApiService,
    private webSocketService: WebSocketService,
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

  getBackgroundStyle() {
    return {
      background: this.backgroundString,
    };
  }

  /**
   * Updates canvas to show live LED view. Uses web sockets.
   */
  private updateWithWebSocket() {
    this.handleUnsubscribe(
      this.webSocketService.getLiveViewSocket())
      .subscribe((leds) => {
        this.fps = this.liveViewService.updateRunningAvgFps();

        // update background
        this.backgroundString = this.liveViewService.getBackgroundStringFromUint8Array(leds);

        // force update the UI
        this.changeDetectorRef.markForCheck();
      });
  }

  /**
   * Updates canvas to show live LED view. Does not use web sockets.
   */
  private update = () => {
    // TODO the api endpoint for this doesn't seem to work anymore
    this.handleUnsubscribe(
      this.stateApiService.getLiveData())
      .subscribe(({ leds }) => {
        try {
          this.backgroundString = this.liveViewService.getBackgroundString(leds);
          this.changeDetectorRef.markForCheck();
        } catch (e) {
        }
      });

    const LIVE_VIEW_WS_FPS = 1; // 10; // TODO add setting in UI
    const timeoutMs = 1000 / LIVE_VIEW_WS_FPS;
    // TODO does this work without interval??
    this.handleUnsubscribe(timer(timeoutMs))
      .subscribe(this.update);
  }
}
