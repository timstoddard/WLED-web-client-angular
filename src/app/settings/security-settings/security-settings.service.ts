import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { timer } from 'rxjs';
import { ApiService } from 'src/app/shared/api-service/api.service';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { ApiResponseParserService } from '../shared/api-response-parser.service';
import { SECURITY_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';
import { SecuritySettings, getNewParsedValuesSubject } from '../shared/settings-types';
import { SecuritySettingsTransformerService } from './security-settings-transformer.service';

@Injectable({ providedIn: 'root' })
export class SecuritySettingsService extends UnsubscriberService {
  readonly PRESETS_FILE_NAME = 'wled_presets.json';
  readonly CONFIG_FILE_NAME = 'wled_cfg.json';
  private parsedValues = getNewParsedValuesSubject();

  constructor(
    private apiService: ApiService,
    private apiResponseParserService: ApiResponseParserService,
    private securitySettingsTransformerService: SecuritySettingsTransformerService,
  ) {
    super();

    const LOAD_API_URL_DELAY_MS = 2000;
    this.handleUnsubscribe(timer(LOAD_API_URL_DELAY_MS))
      .subscribe(() => {
        this.handleUnsubscribe(this.apiService.settings.security.get())
          .subscribe((responseJs) => {
            const {
              formValues,
              metadata,
            } = this.apiResponseParserService.parseJsFile(responseJs, SECURITY_PARSE_CONFIGURATIONS);
            console.log('before transform', formValues)
            this.parsedValues.next({
              formValues: this.securitySettingsTransformerService
                .transformWledSecuritySettingsToSecuritySettings(formValues),
              metadata,
            });
          });
      });
  }

  getParsedValues() {
    return this.parsedValues;
  }

  setSecuritySettings(settings: SecuritySettings) {
    const formValues = this.securitySettingsTransformerService
      .transformSecuritySettingsToWledSecuritySettings(settings);
    return this.apiService.settings.security.set(formValues);
  }

  downloadPresetsFile() {
    saveAs(
      this.apiService.downloadUrl.presets(),
      this.PRESETS_FILE_NAME,
    );
  }

  downloadConfigFile() {
    saveAs(
      this.apiService.downloadUrl.config(),
      this.CONFIG_FILE_NAME,
    );
  }
}
