import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { ApiResponseParserService } from '../shared/api-response-parser.service';
import { SECURITY_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';
import { SecuritySettings, getLoadSettingsDelayTimer, getNewParsedValuesSubject } from '../shared/settings-types';
import { SecuritySettingsTransformerService } from './security-settings-transformer.service';
import { SettingsApiService } from 'src/app/shared/api-service/settings-api.service';
import { FileApiService } from 'src/app/shared/api-service/file-api.service';

@Injectable({ providedIn: 'root' })
export class SecuritySettingsService extends UnsubscriberService {
  readonly PRESETS_FILE_NAME = 'wled_presets.json';
  readonly CONFIG_FILE_NAME = 'wled_cfg.json';
  private parsedValues = getNewParsedValuesSubject();

  constructor(
    private settingsApiService: SettingsApiService,
    private fileApiService: FileApiService,
    private apiResponseParserService: ApiResponseParserService,
    private securitySettingsTransformerService: SecuritySettingsTransformerService,
  ) {
    super();

    this.handleUnsubscribe(getLoadSettingsDelayTimer())
      .subscribe(() => {
        this.handleUnsubscribe(this.settingsApiService.getSecuritySettings())
          .subscribe((responseJs) => {
            const {
              formValues,
              metadata,
              methodCalls,
            } = this.apiResponseParserService.parseJsFile(responseJs, SECURITY_PARSE_CONFIGURATIONS);
            this.parsedValues.next({
              formValues: this.securitySettingsTransformerService
                .transformWledSecuritySettingsToSecuritySettings(formValues),
              metadata,
              methodCalls,
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
    return this.settingsApiService.setSecuritySettings(formValues);
  }

  downloadPresetsFile() {
    saveAs(
      this.fileApiService.getDownloadPresetsUrl(),
      this.PRESETS_FILE_NAME,
    );
  }

  downloadConfigFile() {
    saveAs(
      this.fileApiService.getDownloadConfigUrl(),
      this.CONFIG_FILE_NAME,
    );
  }
}
