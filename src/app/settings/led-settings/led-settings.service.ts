import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api-service/api.service';
import { FormValues } from '../../shared/form-service';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class LedSettingsService {
  constructor(private apiService: ApiService) { }

  setLedSettings(ledSettings: FormValues) {
    return this.apiService.settings.leds.set(ledSettings);
  }
}
