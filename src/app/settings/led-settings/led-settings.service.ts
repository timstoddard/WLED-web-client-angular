import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { FormValues } from '../../shared/form-utils';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class LedSettingsService {
  constructor(private apiService: ApiService) { }

  setLedSettings(ledSettings: FormValues) {
    return this.apiService.setLedSettings(ledSettings);
  }
}
