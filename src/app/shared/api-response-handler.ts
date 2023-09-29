import { Injectable } from '@angular/core';
import { ApiTypeMapper } from './api-type-mapper';
import { WLEDPresets } from './api-types/api-presets';
import { WLEDState } from './api-types/api-state';
import { WLEDApiResponse } from './api-types/api-types';
import { AppStateService } from './app-state/app-state.service';
import { SnackbarService } from './snackbar.service';

// TODO this functionality should be handlded in the selected device service

@Injectable({ providedIn: 'root' })
export class ApiResponseHandler {
  constructor(
    private appStateService: AppStateService,
    private apiTypeMapper: ApiTypeMapper,
    private snackbarService: SnackbarService,
  ) {}

  // TODO audit where this is used, should not be used when a partial json response is expected.
  /** Basic handling for a POST response. */
  handleFullJsonResponse = (customLogic: () => void = () => { }) => (response: WLEDApiResponse, presets?: WLEDPresets) => {
    if (!this.isValidResponse(response)) {
      this.snackbarService.openSnackBar('[ERROR] Received invalid JSON API response.');
    }

    // TODO wire up so this appStateService used if ws connection fails
    this.appStateService.setAll(response, presets);
    console.log('POST response', response, presets);

    // run any custom logic after updating the whole app state
    customLogic();
  };

  /** Basic handling for a POST response containing just the `state` object. */
  handleStateResponse = (customLogic: () => void = () => { }) => (response: WLEDState) => {
    if (!!response) {
      // TODO show error toast
      alert('failed to update');
    }

    // TODO wire up so this appStateService used if ws connection fails
    const newState = this.apiTypeMapper.mapWLEDStateToAppWLEDState(response);
    this.appStateService.updateState(newState);
    console.log('POST response [state only]', response);

    // run any custom logic after updating the whole app state
    customLogic();
  };

  isValidResponse = (result: WLEDApiResponse) =>
    result.state
    && result.info
    && result.palettes
    && result.effects;
}
