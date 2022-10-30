import { Injectable } from '@angular/core';
import { ApiTypeMapper } from './api-type-mapper';
import { WledApiResponse, WledState } from './api-types';
import { AppStateService } from './app-state/app-state.service';

@Injectable({ providedIn: 'root' })
export class PostResponseHandler {
  constructor(
    private appStateService: AppStateService,
    private apiTypeMapper: ApiTypeMapper,
  ) {}

  /** Basic handling for a POST response. */
  handleFullJsonResponse = (customLogic: () => void = () => { }) => (response: WledApiResponse) => {
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
  handleStateResponse = (customLogic: () => void = () => { }) => (response: WledState) => {
    // TODO check for error
    // if (!response.success) {
    //   // TODO show error toast
    //   alert('failed to update');
    // }

    // TODO wire up so this appStateService used if ws connection fails
    this.appStateService.updateState(
      this.apiTypeMapper.mapWledStateToAppWledState(response));
    console.log('POST response [state only]', response);

    // run any custom logic after updating the whole app state
    customLogic();
  };
}
