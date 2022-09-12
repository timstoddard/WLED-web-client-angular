import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OnlineStatusService {
  constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  ngOnDestroy() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  /**
   * Returns boolean for online status.
   * @returns true if online, false otherwise
   */
  getIsOffline() {
    return !window.navigator.onLine;
  }

  private handleOnline = () => {
    alert('Network connection restored.')
  }

  private handleOffline = () => {
    alert('Network connection terminated.')
  }
}
