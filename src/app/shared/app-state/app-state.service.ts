import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { WledApiResponse } from '../api-types';

// TODO add other fields
interface AppStateProps {
  state: {
    on: boolean;
    brightness: number;
    transition: number;
  };
  info: {
    versionName: string;
    versionId: number;
  }
}

const DEFAULT_APP_STATE: AppStateProps = {
  state: {
    on: true,
    brightness: 128,
    transition: 7,
  },
  info: {
    versionName: '',
    versionId: 0,
  },
};

const { state, config } = createState(withProps<AppStateProps>(DEFAULT_APP_STATE));
const appStateStore = new Store({ name: 'WLED App State', state, config });

@Injectable({ providedIn: 'root' })
export class AppStateService {
  getAppState() {
    return appStateStore.pipe(select((n) => n));
  }

  getOn() {
    return appStateStore.pipe(select((n) => n.state.on));
  }

  getBrightness() {
    return appStateStore.pipe(select((n) => n.state.brightness));
  }

  updateAll = (response: WledApiResponse) => {
    appStateStore.update(() => ({
      state: {
        on: response.state.on,
        brightness: response.state.bri,
        transition: response.state.transition,
      },
      info: {
        versionName: response.info.ver,
        versionId: response.info.vid,
      },
    }));
  }

  updateOn = (on: AppStateProps['state']['on']) => {
    appStateStore.update((n) => ({
      state: { ...n.state, on },
      info: n.info,
    }));
  }

  updateBrightness = (brightness: AppStateProps['state']['brightness']) => {
    appStateStore.update((n) => ({
      state: { ...n.state, brightness },
      info: n.info,
    }));
  }

  updateTransition = (transition: AppStateProps['state']['transition']) => {
    appStateStore.update((n) => ({
      state: { ...n.state, transition },
      info: n.info,
    }));
  }
}
