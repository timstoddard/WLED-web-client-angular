import { Injectable } from '@angular/core';
import { FormValues } from '../../shared/form-service';
import { SettingsApiService } from 'src/app/shared/api-service/settings-api.service';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class LedSettingsService {
  constructor(private settingsApiService: SettingsApiService) { }

  setLedSettings(ledSettings: FormValues) {
    return this.settingsApiService.setLedSettings(ledSettings);
  }
}
