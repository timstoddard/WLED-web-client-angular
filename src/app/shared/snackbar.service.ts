import { MatSnackBar } from '@angular/material/snack-bar';
import { UnsubscriberService } from './unsubscriber/unsubscriber.service';
import { Injectable } from '@angular/core';

const SNACKBAR_DISMISS_DURATION_MS = 3000;

@Injectable({ providedIn: 'root' })
export class SnackbarService extends UnsubscriberService {
  constructor(
    private _snackBar: MatSnackBar,
  ) {
    super();
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    const snackBarRef = this._snackBar.open(message, action, {
      duration: SNACKBAR_DISMISS_DURATION_MS,
    });
    this.handleUnsubscribe(snackBarRef.onAction())
      .subscribe(() => snackBarRef.dismiss());
  }
}
