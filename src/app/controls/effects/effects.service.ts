import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../shared/api-http.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class EffectsService {
  constructor(private apiHttp: ApiHttpService) { }

  // TODO is this needed?
  getEffects() {
    return this.apiHttp.getEffects();
  }
}
