// Types based the WLED JSON API info page: https://kno.wled.ge/interfaces/json-api
// Types correspond to WLED version https://github.com/Aircoookie/WLED/releases/tag/v0.13.3.

import { WLEDInfo } from './api-info';
import { WLEDState } from './api-state';

export interface WLEDApiResponse {
  /** WLED app state, all fields are settable. */
  state: WLEDState;
  /** Read-only info about WLED and its configuration. */
  readonly info: WLEDInfo;
  // TODO add effect metadata https://kno.wled.ge/interfaces/json-api/#effect-metadata
  /** List of effect names. */
  effects: string[];
  /** List of palette names. */
  palettes: string[];
}
