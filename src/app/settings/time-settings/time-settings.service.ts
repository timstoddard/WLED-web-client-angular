import { Injectable } from '@angular/core';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { ApiResponseParserService } from '../shared/api-response-parser.service';
import { TIME_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';
import { TimeSettings, getLoadSettingsDelayTimer, getNewParsedValuesSubject } from '../shared/settings-types';
import { TimeSettingsTransformerService } from './time-settings-transfomer.service';
import { SettingsApiService } from 'src/app/shared/api-service/settings-api.service';

@Injectable({ providedIn: 'root' })
export class TimeSettingsService extends UnsubscriberService {
  private parsedValues = getNewParsedValuesSubject();

  constructor(
    private settingsApiService: SettingsApiService,
    private apiResponseParserService: ApiResponseParserService,
    private timeSettingsTransformerService: TimeSettingsTransformerService,
  ) {
    super();

    this.handleUnsubscribe(getLoadSettingsDelayTimer())
      .subscribe(() => {
        this.handleUnsubscribe(this.settingsApiService.getTimeSettings())
          .subscribe((responseJs) => {
            const {
              formValues,
              metadata,
            } = this.apiResponseParserService.parseJsFile(responseJs, TIME_PARSE_CONFIGURATIONS);
            this.parsedValues.next({
              formValues: this.timeSettingsTransformerService
                .transformWledTimeSettingsToTimeSettings(formValues),
              metadata,
            });
          });
      });
  }

  getParsedValues() {
    return this.parsedValues;
  }

  setTimeSettings(settings: TimeSettings) {
    const formValues = this.timeSettingsTransformerService
      .transformTimeSettingsToWledTimeSettings(settings);
    return this.settingsApiService.setTimeSettings(formValues);
  }
}
