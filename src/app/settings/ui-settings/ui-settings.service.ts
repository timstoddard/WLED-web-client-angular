import { Injectable } from '@angular/core';
import { SettingsApiService } from 'src/app/shared/api-service/settings-api.service';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class UISettingsService {
  constructor(private settingsApiService: SettingsApiService) { }

  setUISettings(uiSettings: any /* TODO type */) {
    return this.settingsApiService.setUISettings(uiSettings);
  }
}
