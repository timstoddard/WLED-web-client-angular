import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { ControlsServicesModule } from './controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class ControlsService {
  constructor(private apiService: ApiService) {}

  requestJson(command: any /* TODO type */, rinfo = true) {
    this.apiService.requestJson(command, rinfo);
  }
}
