import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class PalettesService {
  constructor(private apiService: ApiService) {}

  // TODO is this needed?
  getPalettes() {
    return this.apiService.getPalettes();
  }

  setPalette(paletteId: number) {
    return this.apiService.setPalette(paletteId);
  }
}
