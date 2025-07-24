import { Injectable } from '@angular/core';
import { UnsubscriberService } from 'src/app/shared/unsubscriber/unsubscriber.service';
import { ApiResponseParserService } from '../shared/api-response-parser.service';
import { TIME_PARSE_CONFIGURATIONS } from '../shared/settings-parse-configurations';
import { TimeSettings, WledTimeSettings, getLoadSettingsDelayTimer, getNewParsedValuesSubject } from '../shared/settings-types';
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
              formCheckboxes,
              formSelectedIndexes,
              metadata,
              methodCalls,
            } = this.apiResponseParserService.parseJsFile(responseJs, TIME_PARSE_CONFIGURATIONS);
            this.parsedValues.next({
              formValues: this.timeSettingsTransformerService
                .transformWledTimeSettingsToTimeSettings({
                  ...formValues,
                  ...formCheckboxes,
                  ...formSelectedIndexes,
                }, methodCalls),
              metadata,
              methodCalls,
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


// TODO save all reasonable defaults somewhere for easy access after reboot
const MY_REASONABLE_DEFAULTS = {
  NS: '0.wled.pool.ntp.org',
  TZ: 8 /* PST */,
  UO: 0,
  LN: 0 as unknown as string,
  LT: 0 as unknown as string,
  O1: 1,
  O2: 40,
  OM: 0,
  CY: 25,
  CI: 1,
  CD: 1,
  CH: 0,
  CM: 0,
  CS: 0,
  A0: 0,
  A1: 0,
  MC: 0,
  MN: 0,
  MP0: 0,
  ML0: 0,
  MD0: 0,
  MP1: 0,
  ML1: 0,
  MD1: 0,
  MP2: 0,
  ML2: 0,
  MD2: 0,
  MP3: 0,
  ML3: 0,
  MD3: 0,
  // scheduled preset 0
  H0: 0,
  N0: 0,
  T0: 0,
  W0: 255,
  M0: 1,
  P0: 12,
  D0: 1,
  E0: 31,
  // scheduled preset 1
  H1: 0,
  N1: 0,
  T1: 0,
  W1: 255,
  M1: 1,
  P1: 12,
  D1: 1,
  E1: 31,
  // scheduled preset 3
  H2: 0,
  N2: 0,
  T2: 0,
  W2: 255,
  M2: 1,
  P2: 12,
  D2: 1,
  E2: 31,
  // scheduled preset 3
  H3: 0,
  N3: 0,
  T3: 0,
  W3: 255,
  M3: 1,
  P3: 12,
  D3: 1,
  E3: 31,
  // scheduled preset 4
  H4: 0,
  N4: 0,
  T4: 0,
  W4: 255,
  M4: 1,
  P4: 12,
  D4: 1,
  E4: 31,
  // scheduled preset 5
  H5: 0,
  N5: 0,
  T5: 0,
  W5: 255,
  M5: 1,
  P5: 12,
  D5: 1,
  E5: 31,
  // scheduled preset 6
  H6: 0,
  N6: 0,
  T6: 0,
  W6: 255,
  M6: 1,
  P6: 12,
  D6: 1,
  E6: 31,
  // scheduled preset 7
  H7: 0,
  N7: 0,
  T7: 0,
  W7: 255,
  M7: 1,
  P7: 12,
  D7: 1,
  E7: 31,
  // scheduled preset 8
  N8: 0,
  T8: 0,
  W8: 255,
  // scheduled preset 9
  N9: 0,
  T9: 0,
  W9: 255,
  // optional boolean settings (existence = true)
  // NT: 'on',
  // CF: 'on',
  // OL: 'on',
  // O5: 'on',
  // OS: 'on',
  // OB: 'on',
  // CE: 'on',
} as WledTimeSettings;
