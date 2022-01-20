import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../shared/api-http.service';
import { ControlsModule } from '../controls.module';

// TODO should be able to provide in controls module
// @Injectable({ providedIn: ControlsModule })
@Injectable({ providedIn: 'root' })
export class PalettesService {
  constructor(private apiHttp: ApiHttpService) {}

  getPalettes() {
    return this.apiHttp.getPalettes('');
  }
}
