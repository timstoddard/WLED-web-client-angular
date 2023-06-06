import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/api-service/api.service';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { ApiResponseParserService } from '../shared/api-response-parser.service';
import { TIME_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';
import { TimeSettings, getLoadSettingsDelayTimer, getNewParsedValuesSubject } from '../shared/settings-types';
import { TimeSettingsTransformerService } from './time-settings-transfomer.service';

@Injectable({ providedIn: 'root' })
export class TimeSettingsService extends UnsubscriberService {
  private parsedValues = getNewParsedValuesSubject();

  constructor(
    private apiService: ApiService,
    private apiResponseParserService: ApiResponseParserService,
    private timeSettingsTransformerService: TimeSettingsTransformerService,
  ) {
    super();

    this.handleUnsubscribe(getLoadSettingsDelayTimer())
      .subscribe(() => {
        this.handleUnsubscribe(this.apiService.settings.time.get())
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
    return this.apiService.settings.time.set(formValues);
  }
}
