import { Injectable } from '@angular/core';
import { AppClientConfig } from './app-types/app-types';
import { DEFAULT_APP_STATE } from './app-state/app-state-defaults';

export enum LocalStorageKey {
  PALETTES_DATA = 'PALETTES_DATA',
  SAVED_PRESETS = 'SAVED_PRESETS',
  SHOW_DEV_NAV_BAR = 'SHOW_DEV_NAV_BAR',
  // TODO combine UI_CONFIG & CLIENT_CONFIG if it makes sense to do so
  UI_CONFIG = 'UI_CONFIG', // not saved in backend; copied settings from WLED app
  CLIENT_CONFIG = 'CLIENT_CONFIG', // not saved in backend, new settings for this app
}

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  /**
   * Takes a key parameter and a value parameter. The key allows you to retrieve the value later using lookups. The value is stored as a JSON string. This method does not return anything.
   * @param key 
   * @param data 
   */
  set(key: string, data: string | number | boolean | Object): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Takes a key parameter for looking up data in storage. If this lookup fails it will return a null value.
   * @param key 
   */
  get<T>(key: string, defaultIfNull: T): T {
    const value = localStorage.getItem(key);
    return value !== null
      ? JSON.parse(value)
      : defaultIfNull;
  }

  /**
   * Takes a key parameter for looking up data in storage.
   * @param key 
   */
  remove(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Takes no parameters. Clears all data in local storage.
   */
  clear() {
    localStorage.clear();
  }

  updateAndSaveClientConfig = (
    newClientConfig: Partial<AppClientConfig>,
  ) => {
    const clientConfig = this.updateAndSaveLocalStorageItem<AppClientConfig>(
      LocalStorageKey.CLIENT_CONFIG,
      {
        ...newClientConfig,
        // don't save this as true, live view should be off by default
        isLiveViewActive: false,
      },
      DEFAULT_APP_STATE.localSettings,
    );
    return clientConfig;
  }

  /**
   * Coalesces an object with the default value, the local storage value (if any), and the new values.
   * Saves the combined value to local storage before returning it.
   * Call with `newValues=null` to get the value saved in local storage.
   * @param newValues 
   * @param localStorageKey 
   * @param defaultValueMap 
   * @returns 
   */
  private updateAndSaveLocalStorageItem = <T>(
    localStorageKey: LocalStorageKey,
    newValues: Partial<T> = {},
    defaultValueMap: { [key: string]: any } = {},
  ) => {
    const localSettings = Object.assign({},
      defaultValueMap,
      this.get(localStorageKey, {}),
      newValues,
    );
    this.set(localStorageKey, localSettings);
    return localSettings;
  }
}
