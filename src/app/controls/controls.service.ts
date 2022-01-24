import { Injectable } from '@angular/core';
import { ApiHttpService } from '../shared/api-http.service';
import { ControlsServicesModule } from './controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class ControlsService {
  constructor(private apiHttp: ApiHttpService) {}

  requestJson(command: any /* TODO type */, rinfo = true) {
    this.apiHttp.requestJson(command, rinfo);
  }
}
