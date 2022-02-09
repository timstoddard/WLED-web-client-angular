import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';

// TODO add other fields
interface AppStateProps {
  brightness: number;
}

const DEFAULT_APP_STATE: AppStateProps = {
  brightness: 1,
};

const { state, config } = createState(withProps<AppStateProps>(DEFAULT_APP_STATE));
const appStateStore = new Store({ name: 'WLED App State', state, config });

@Injectable({ providedIn: 'root' })
export class AppStateRepository {
  appState$ = appStateStore.pipe(select((state) => state.brightness));
  
  updateBrightness = (brightness: AppStateProps['brightness']) => {
    appStateStore.update((state) => ({
      ...state,
      brightness,
    }));
  }
}
