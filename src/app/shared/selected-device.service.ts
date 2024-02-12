import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UnsubscriberService } from './unsubscriber/unsubscriber.service';
import { WLEDApiResponse } from './api-types/api-types';
import { map, of, timeout } from 'rxjs';
import { ApiPath } from './api-service/api-paths';
import { AppStateService } from './app-state/app-state.service';
import { SnackbarService } from './snackbar.service';
import { WLEDIpAddress } from './app-types/app-types';
import { NO_DEVICE_IP_SELECTED } from './app-state/app-state-defaults';
import { Router } from '@angular/router';
import { responseTypeAsJsonHack } from '../controls-wrapper/utils';
import { WLEDState } from './api-types/api-state';

export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
}

enum ConnectionSnackbarMessage {
  DISCONNECTED = 'Disconnected from WLED',
  CONNECTING = 'Connecting to device',
  CONNECTED = 'Connected to device',
  CONNECTION_FAILURE = 'Unable to connect to',
}

const DEFAULT_CONNECTION_TEST_TIMEOUT_MS = 3000;
export const HTTP_GET_FAILED = 'HTTP_GET_FAILED';

@Injectable({ providedIn: 'root' })
export class SelectedDeviceService extends UnsubscriberService {
  private selectedDeviceIpAddress = '';
  private connectionStatus!: ConnectionStatus;

  constructor(
    private http: HttpClient,
    private appStateService: AppStateService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {
    super();
    this.connectionStatus = ConnectionStatus.DISCONNECTED;
  }

  getIpAddress = () => {
    return this.selectedDeviceIpAddress;
  }

  private setIpAddress = (selectedDeviceIpAddress: string) => {
    this.selectedDeviceIpAddress = selectedDeviceIpAddress;
    console.log(`Selected device IP address: ${this.selectedDeviceIpAddress}`);
  }

  getConnectionStatus = () => {
    return this.connectionStatus;
  }

  private setConnectionStatus = (connectionStatus: ConnectionStatus) => {
    this.connectionStatus = connectionStatus;
  }

  isNoDeviceSelected = () => {
    return this.selectedDeviceIpAddress === NO_DEVICE_IP_SELECTED.ipv4Address
      || this.connectionStatus === ConnectionStatus.DISCONNECTED;
  }

  /**
   * Attempts to connect to the device ip address, and if successful, sets it as the
   * currently selected ip address in the app state.
   * @param wledIpAddress ip address to attempt to connect to
   * @param onSuccess custom logic for the success case
   * @param onFailure custom logic for the failure case
   */
  setSelectedDevice = (
    wledIpAddress: WLEDIpAddress,
    onSuccess: () => void = () => {},
    onFailure: () => void = () => {},
  ) => {
    // prevent connecting to a new device if one is already connecting
    if (this.connectionStatus === ConnectionStatus.CONNECTING) {
      this.snackbarService.openSnackBar('Already connecting to a device.');
      return;
    }

    console.log('Attempting to connect:', wledIpAddress);
    this.appStateService.setLocalSettings({
      selectedWLEDIpAddress: wledIpAddress,
    });

    if (wledIpAddress.ipv4Address === NO_DEVICE_IP_SELECTED.ipv4Address) {
      // simple case - no device selected
      this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
      onSuccess();
      this.openDeviceConnectSnackbar(ConnectionSnackbarMessage.DISCONNECTED, wledIpAddress);

      // remove query param ip address
      this.router.navigate([]);
    } else {
      // attempt to connect to the selected device's IP address
      this.setConnectionStatus(ConnectionStatus.CONNECTING);
      this.openDeviceConnectSnackbar(ConnectionSnackbarMessage.CONNECTING, wledIpAddress);

      this.testConnectToDeviceIpAddress(wledIpAddress, true, onSuccess, onFailure);
    }
  }

  /**
   * Tests a given IP address by attempting to load the full json data. If json data is returned
   * and correctly formed, the onSuccess function will be called. Otherwise, the test fails and
   * the onFailure function will be called.
   * @param ipAddress ip address to test
   * @param saveIpAddressOnSuccess if successful, save ip address in app state
   * @param onSuccess function to be called on success
   * @param onFailure function to be called on failure
   */
  testConnectToDeviceIpAddress = (
    wledIpAddress: WLEDIpAddress,
    saveIpAddressOnSuccess = true,
    onSuccess: () => void = () => {},
    onFailure: () => void = () => {},
  ) => {
    const ipAddress = wledIpAddress.ipv4Address;
    const url = `http://${ipAddress}/${ApiPath.UPTIME}`;
    const testResult = this.loadUrlWithTimeout<WLEDApiResponse>(url);

    const successFn = () => {
      onSuccess();
      if (saveIpAddressOnSuccess) {
        this.setIpAddress(ipAddress);
        this.setConnectionStatus(ConnectionStatus.CONNECTED);
        this.openDeviceConnectSnackbar(ConnectionSnackbarMessage.CONNECTED, wledIpAddress);

        // route to controls for that IP address
        this.router.navigate([], {
          queryParams: { ip: ipAddress },
          queryParamsHandling: 'merge',
        });
      }
    }

    const failureFn = () => {
      onFailure();
      if (saveIpAddressOnSuccess) {
        this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
        this.openDeviceConnectSnackbar(ConnectionSnackbarMessage.CONNECTION_FAILURE, wledIpAddress);
      }
    }

    this.handleUnsubscribe(testResult)
      .pipe(
        map(result => {
          let success = false;

          if (result === HTTP_GET_FAILED) {
            // it didn't work
            success = false;
          } else if ((typeof result === 'number') && (result > 0)) {
            // it worked
            success = true;
          }

          return { success, result };
        }),
      )
      .subscribe({
        next: ({ success }) => {
          if (success) {
            successFn();
          } else {
            failureFn();
          }
        },
        error: () => failureFn(),
      });
  }

  /**
   * Wraps the default http.get() with a shorter timeout.
   * @param url url to get
   * @param options http options
   * @param timeoutMs optional param to override the timeout in milliseconds
   * @returns http get response, or a failure message
   */
  loadUrlWithTimeout = <T>(
    url: string,
    options: {
      // subset of options for http.get()
      params?: HttpParams,
      responseType?: 'json' | 'text' | 'blob',
    } = {},
    timeoutMs = DEFAULT_CONNECTION_TEST_TIMEOUT_MS,
  ) => {
    const parsedOptions = {
      ...options,
      responseType: responseTypeAsJsonHack(options.responseType),
    }
    return this.http.get<T>(url, parsedOptions)
      .pipe(
        timeout({
          first: timeoutMs,
          with: () => of<typeof HTTP_GET_FAILED>(HTTP_GET_FAILED),
        }),
      );
  }

  private openDeviceConnectSnackbar = (
    status: string,
    wledIpAddress: WLEDIpAddress,
  ) => {
    const message = wledIpAddress.ipv4Address !== NO_DEVICE_IP_SELECTED.ipv4Address
      ? `${status}: ${wledIpAddress.name} (${wledIpAddress.ipv4Address})`
      : status;
    this.snackbarService.openSnackBar(message);
  }

  isValidStateInfoResponse = (result: WLEDApiResponse) =>
    result.state
    && result.info;

  isValidStateResponse = (result: WLEDState) =>
    typeof result.bri === 'number'
    && typeof result.on === 'boolean'
    && Array.isArray(result.seg);
}
