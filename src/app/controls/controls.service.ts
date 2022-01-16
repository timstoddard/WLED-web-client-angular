import { Injectable } from '@angular/core';
import { ApiHttpService } from '../shared/api-http.service';
import { ControlsModule } from './controls.module';

@Injectable({ providedIn: ControlsModule })
export class ControlsService {
  constructor(private apiHttp: ApiHttpService) {}

  requestJson(command: any /* TODO type */, rinfo = true) {
    this.apiHttp.requestJson(command, rinfo);
  }
}
