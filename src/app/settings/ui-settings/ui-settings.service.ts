import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api-service/api.service';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class UISettingsService {
  constructor(private apiService: ApiService) { }

  setUISettings(uiSettings: any /* TODO type */) {
    return this.apiService.settings.ui.set(uiSettings);
  }
}
