import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SnackbarService } from './snackbar.service';
import { SelectedDeviceService } from './selected-device.service';

@Injectable({ providedIn: 'root' })
export class OnlineStatusService {
  // TODO what will use this?
  private onlineStatus$: Subject<boolean>;

  constructor(
    private selectedDeviceService: SelectedDeviceService,
    private snackbarService: SnackbarService,
  ) {
    this.onlineStatus$ = new BehaviorSubject(this.getIsOffline());
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  ngOnDestroy() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  /**
   * Returns a subject that emits true when network connection is restored, and false when network connection is lost.
   * @returns 
   */
  getOnlineStatus$() {
    return this.onlineStatus$;
  }

  /**
   * Returns boolean for online status.
   * @returns true if online, false otherwise
   */
  getIsOffline() {
    const isOffline = !window.navigator.onLine
      || this.selectedDeviceService.isNoDeviceSelected()
    return isOffline;
  }

  private handleOnline = () => {
    this.onlineStatus$.next(true);
    this.snackbarService.openSnackBar('Network connection restored.');
  }

  private handleOffline = () => {
    this.onlineStatus$.next(false);
    this.snackbarService.openSnackBar('Network connection terminated.');
    alert()
  }
}
