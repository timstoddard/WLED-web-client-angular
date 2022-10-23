import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { UnsubscriberService } from '../../shared/unsubscribing/unsubscriber.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class InfoService extends UnsubscriberService {
  constructor(private apiService: ApiService) {
    super();
  }

  refreshAppState() {
    this.apiService.refreshAppState();
  }
}
