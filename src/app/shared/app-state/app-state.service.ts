import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { map, Subject, takeUntil } from 'rxjs';
import { ApiTypeMapper } from '../api-type-mapper';
import { WLEDNodesResponse } from '../api-types/api-nodes';
import { WLEDPresets } from '../api-types/api-presets';
import { WLEDApiResponse } from '../api-types/api-types';
import { AppInfo } from '../app-types/app-info';
import { AppSegment, AppWLEDState } from '../app-types/app-state';
import { AppState } from '../app-types/app-types';
import { ClientOnlyFieldsService, ClientOnlySegmentFieldsMap } from '../client-only-fields.service';
import { DEFAULT_APP_STATE } from './app-state-defaults';
import { LocalStorageService } from '../local-storage.service';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import { WLEDInfo } from '../api-types/api-info';

@Injectable({ providedIn: 'root' })
export class AppStateService extends UnsubscriberService {
  private appStateStore: Store;

  constructor(
    private apiTypeMapper: ApiTypeMapper,
    private clientOnlyFieldsService: ClientOnlyFieldsService,
    private localStorageService: LocalStorageService,
  ) {
    super();
    const clientConfig = this.localStorageService.updateAndSaveClientConfig({});
    const defaultStateWithSavedSettings = Object.assign({}, 
      DEFAULT_APP_STATE,
      {
        localSettings: clientConfig,
      },
    );
    this.appStateStore = new Store({
      name: 'WLED App State',
      ...createState(withProps<AppState>(defaultStateWithSavedSettings)),
    });
  }

  /** Set all app state fields using the api response data. */
  setAll = (response: WLEDApiResponse, effectsData?: string[], presets?: WLEDPresets) => {
    this.appStateStore.update((state) =>
      this.apiTypeMapper.mapWLEDApiResponseToAppState(state, response, effectsData, presets));
  }

  setInfo = (response: WLEDInfo) => {
    this.appStateStore.update((state) => ({
      ...state,
      info: this.apiTypeMapper.mapWLEDInfoToAppInfo(response),
    }));
  }

  /** Updates nodes data using API response. */
  setWLEDNodes = (response: WLEDNodesResponse) => {
    this.appStateStore.update((state) => ({
      ...state,
      nodes: this.apiTypeMapper.mapWLEDNodesToAppNodes(response),
    }));
  };

  /** Updates presets data using API response. */
  setWLEDPresets = (response: WLEDPresets) => {
    this.appStateStore.update((state) => ({
      ...state,
      presets: this.apiTypeMapper.mapWLEDPresetsToAppPresets(response),
    }));
  };

  // getters
  getAppState = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState<AppState>((n) => n, ngUnsubscribe);
  getWLEDState = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState<AppWLEDState>((n) => n.state, ngUnsubscribe);
  getInfo = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState<AppInfo>((n) => n.info, ngUnsubscribe);
  getSegments = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState<AppWLEDState['segments']>((n) => n.state.segments, ngUnsubscribe);
  getSelectedSegment = (ngUnsubscribe: Subject<void>) =>
    this.getWLEDState(ngUnsubscribe)
      .pipe<AppSegment>(
        map(({ segments, mainSegmentId }: AppWLEDState) => {
          // TODO account for segment.id property
          // (if segments are not sorted by id)
          const segmentId = mainSegmentId ?? 0;
          const selectedSegment = segments[segmentId];
          return selectedSegment || null;
        }),
      );
  getPalettes = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState<AppState['palettes']>((n) => n.palettes, ngUnsubscribe);
  getEffects = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState<AppState['effects']>((n) => n.effects, ngUnsubscribe);
  getLocalSettings = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState<AppState['localSettings']>((n) => n.localSettings, ngUnsubscribe);
  getPresets = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState<AppState['presets']>((n) => n.presets, ngUnsubscribe);

  // setters
  setSegments = (segments: AppWLEDState['segments']) => {
    this.updateState({ segments });
    // update client only fields store
    const clientOnlyFieldsMap: ClientOnlySegmentFieldsMap = {};
    for (const segment of segments) {
      clientOnlyFieldsMap[segment.id] = {
        isExpanded: segment.isExpanded,
      };
    }
    this.clientOnlyFieldsService.updateSegmentIds(clientOnlyFieldsMap);
  }
  // setPalettes = (palettes: AppState['palettes']) => {
  //   this.appStateStore.update((appState) => ({
  //     ...appState,
  //     palettes,
  //   }));
  // }
  // setEffects = (effects: AppState['effects']) => {
  //   this.appStateStore.update((appState) => ({
  //     ...appState,
  //     effects,
  //   }));
  // }
  setLocalSettings = (localSettings: Partial<AppState['localSettings']>) => {
    this.appStateStore.update((appState) => ({
      ...appState,
      localSettings: {
        ...appState.localSettings,
        ...localSettings,
      },
    }));
    this.localStorageService.updateAndSaveClientConfig(localSettings);
  }
  setNodes = (nodes: AppState['nodes']) => {
    this.appStateStore.update((appState) => ({
      ...appState,
      nodes,
    }));
  }
  setPresets = (presets: AppState['presets']) => {
    this.appStateStore.update((appState) => ({
      ...appState,
      presets,
    }));
  }

  updateState = (newState: Partial<AppWLEDState>) => {
    this.appStateStore.update((appState) => ({
      ...appState,
      state: {
        ...appState.state,
        ...newState,
      },
    }));
  }

  private selectFromAppState = <T>(
    selectFn: (state: AppState) => any,
    ngUnsubscribe: Subject<void>,
  ) =>
    this.appStateStore
      .pipe(takeUntil(ngUnsubscribe))
      .pipe<T>(select(selectFn));
}
