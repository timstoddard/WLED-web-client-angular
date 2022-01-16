import { ApiHttpService } from '../../shared/api-http.service';

export class PalettesService {
  constructor(private apiHttp: ApiHttpService) {}

  getPalettes() {
    return this.apiHttp.getPalettes('');
  }
}
