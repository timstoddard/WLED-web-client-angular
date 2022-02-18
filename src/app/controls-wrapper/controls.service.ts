import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { AppStateService } from '../shared/app-state/app-state.service';
import { UnsubscribingService } from '../shared/unsubscribing.service';
import { WebSocketService } from '../shared/web-socket.service';
import { ControlsServicesModule } from './controls-services.module';
import { SegmentsService } from './segments/segments.service';

@Injectable({ providedIn: ControlsServicesModule })
export class ControlsService extends UnsubscribingService {
  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService,
    private appStateService: AppStateService,
    private segmentsService: SegmentsService,
  ) {
    super();
    this.subscribeToAppStateChanges();
  }

  requestJson(command: any /* TODO type */, rinfo = true) {
    this.apiService.requestJson(command, rinfo);
  }

  private subscribeToAppStateChanges() {
    this.webSocketService.getStateInfoSocket()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        this.appStateService.setAll(response);
        this.segmentsService.loadApiSegments(response.state.seg);
      });
  }
}
