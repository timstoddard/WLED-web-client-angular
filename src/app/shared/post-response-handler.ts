import { Injectable } from '@angular/core';
import { ApiTypeMapper } from './api-type-mapper';
import { WLEDApiResponse, WLEDState } from './api-types';
import { AppStateService } from './app-state/app-state.service';

// TODO can this functionality be provided directly in the api service?
// so we don't have to import & call it in many places

@Injectable({ providedIn: 'root' })
export class PostResponseHandler {
  constructor(
    private appStateService: AppStateService,
    private apiTypeMapper: ApiTypeMapper,
  ) {}

  /** Basic handling for a POST response. */
  handleFullJsonResponse = (customLogic: () => void = () => { }) => (response: WLEDApiResponse) => {
    // TODO check for error
    // if (!response.success) {
    //   // TODO show error toast
    //   alert('failed to update');
    // }

    // TODO wire up so this appStateService used if ws connection fails
    this.appStateService.setAll(response);
    console.log('POST response', response);

    // run any custom logic after updating the whole app state
    customLogic();
  };

  /** Basic handling for a POST response containing just the `state` object. */
  handleStateResponse = (customLogic: () => void = () => { }) => (response: WLEDState) => {
    // TODO check for error
    // if (!response.success) {
    //   // TODO show error toast
    //   alert('failed to update');
    // }

    // TODO wire up so this appStateService used if ws connection fails
    const newState = this.apiTypeMapper.mapWLEDStateToAppWLEDState(response);
    this.appStateService.updateState(newState);
    console.log('POST response [state only]', response);

    // run any custom logic after updating the whole app state
    customLogic();
  };
}
