import { Injectable } from '@angular/core';
import { LocalStorageKey, LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class OnlineStatusService {
  constructor(private localStorageService: LocalStorageService) {}

  /**
   * Returns boolean for online status.
   * @returns true if online, false otherwise
   */
  getIsOffline() {
    // TODO detect online/offline status, don't use local storage anymore

    /**
     * To enable:
     * localStorage.setItem('IS_OFFLINE', true);localStorage.getItem('IS_OFFLINE');
     * 
     * To disable:
     * localStorage.setItem('IS_OFFLINE', false);localStorage.getItem('IS_OFFLINE');
     */
    const isOffline = this.localStorageService.get(LocalStorageKey.IS_OFFLINE);
    return isOffline
  }
}
