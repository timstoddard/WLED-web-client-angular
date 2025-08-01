import { Injectable } from '@angular/core';
import { FormValues } from '../../shared/form-service';
import { SettingsApiService } from 'src/app/shared/api-service/settings-api.service';
import { getLoadSettingsDelayTimer, getNewParsedValuesSubject, WledLEDSettings } from '../shared/settings-types';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { ApiResponseParserService } from '../shared/api-response-parser.service';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';
import { LEDSettingsTransformerService } from './led-settings-transformer.service';
import { LED_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class LedSettingsService extends UnsubscriberService {
  /** Store the values from the parsed js file for the initial form values and view rendering. */
  private parsedValues = getNewParsedValuesSubject();

  constructor(
    private settingsApiService: SettingsApiService,
    private apiResponseParserService: ApiResponseParserService,
    private appStateService: AppStateService,
    private ledSettingsTransformerService: LEDSettingsTransformerService,
  ) {
    super();

    this.handleUnsubscribe(getLoadSettingsDelayTimer())
      .subscribe(() => {
        this.handleUnsubscribe(this.settingsApiService.getLEDSettings())
          .subscribe((responseJs) => {
            const {
              formValues,
              formCheckboxes,
              formSelectedIndexes,
              metadata,
              methodCalls,
            } = this.apiResponseParserService.parseJsFile(responseJs, LED_PARSE_CONFIGURATIONS);

            const transformedSettings = this.ledSettingsTransformerService.transformWledLEDSettingsToLEDSettings({
              ...formValues,
              ...formCheckboxes,
              ...formSelectedIndexes,
            } as unknown as WledLEDSettings);
            console.log('transformedSettings', transformedSettings)
            console.log('metadata', metadata)

            // TODO get this working

            // this.parsedValues.next({
            //   formValues: this.ledSettingsTransformerService
            //     .transformWledLEDSettingsToLEDSettings(formValues as unknown as WledLEDSettings),
            //   metadata,
            // });
          }); // */
      });
  }

  getParsedValues() {
    return this.parsedValues;
  }

  setLedSettings(ledSettings: FormValues) {
    return this.settingsApiService.setLedSettings(ledSettings);
  }
}
