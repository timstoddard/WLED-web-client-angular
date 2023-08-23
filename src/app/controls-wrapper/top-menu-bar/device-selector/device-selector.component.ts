import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/api-service/api.service';
import { NO_DEVICE_IP_SELECTED } from '../../../shared/app-state/app-state-defaults';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { WLEDIpAddress } from '../../../shared/app-types/app-types';
import { OverlayPositionService } from '../../../shared/overlay-position.service';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { SnackbarService } from 'src/app/shared/snackbar.service';

enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  LOADING = 'LOADING',
}

@Component({
  selector: 'app-device-selector',
  templateUrl: './device-selector.component.html',
  styleUrls: ['./device-selector.component.scss']
})
export class DeviceSelectorComponent extends UnsubscriberComponent implements OnInit {
  @Input() selectClass: string = '';
  wledIpAddresses!: WLEDIpAddress[];
  selectedWLEDIpAddress!: WLEDIpAddress;
  connectionStatus!: ConnectionStatus;
  showList!: boolean;

  constructor(
    private appStateService: AppStateService,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private overlayPositionService: OverlayPositionService,
    private snackbarService: SnackbarService,
  ) {
    super();
  }

  ngOnInit() {
    this.wledIpAddresses = [];
    this.selectedWLEDIpAddress = NO_DEVICE_IP_SELECTED;
    this.connectionStatus = ConnectionStatus.DISCONNECTED;
    this.showList = false;

    this.appStateService.getLocalSettings(this.ngUnsubscribe)
      .subscribe(({
        selectedWLEDIpAddress,
        wledIpAddresses,
      }) => {
        this.selectedWLEDIpAddress = selectedWLEDIpAddress;
        this.wledIpAddresses = wledIpAddresses;
      });
  }

  ngAfterViewInit() {
    // TODO get connected/disconnected status from API service using an observable
    // (what about loading animation?)

    const DEVICE_CONNECT_TIMEOUT_MS = 500;
    setTimeout(() => {
      if (this.wledIpAddresses.length >= 1) {
        // trigger connecting animation on load
        this.setSelectedDevice(this.selectedWLEDIpAddress);
      }
    }, DEVICE_CONNECT_TIMEOUT_MS);
  }

  getSelectedDeviceName() {
    return this.selectedWLEDIpAddress.name === NO_DEVICE_IP_SELECTED.name
      ? 'Select Device'
      : this.selectedWLEDIpAddress.name;
  }

  getWledIpAddressesForDropdown() {
    return [
      NO_DEVICE_IP_SELECTED,
      ...this.wledIpAddresses,
    ];
  }

  setSelectedDevice = (wledIpAddress: WLEDIpAddress) => {
    // prevent connecting to a new device if one is already connecting
    if (this.connectionStatus === ConnectionStatus.LOADING) {
      this.snackbarService.openSnackBar('Already connecting to a device.');
      return;
    }

    console.log('selecting wledIpAddress:', wledIpAddress);
    this.appStateService.setLocalSettings({
      selectedWLEDIpAddress: wledIpAddress,
    });

    if (wledIpAddress.ipv4Address === NO_DEVICE_IP_SELECTED.ipv4Address) {
      // simple case - no device selected
      this.handleTestIpAddressResponse(ConnectionStatus.DISCONNECTED, true);
      this.snackbarService.openSnackBar('Disconnected from WLED');
    } else {
      // attempt to connect to the selected device's IP address
      this.connectionStatus = ConnectionStatus.LOADING;
      this.openDeviceConnectSnackbar('Connecting to device', wledIpAddress);

      this.apiService.testIpAddressAsBaseUrl(
        wledIpAddress.ipv4Address,
        () => {
          this.handleTestIpAddressResponse(ConnectionStatus.CONNECTED, true);
          this.openDeviceConnectSnackbar('Connected to device', wledIpAddress);
        },
        () => {
          this.handleTestIpAddressResponse(ConnectionStatus.DISCONNECTED);
          this.openDeviceConnectSnackbar('Failed to connect to device', wledIpAddress);
        },
      );
    }
  }

  handleAddLinkClick(event: Event) {
    event.stopImmediatePropagation();
    this.showList = false;
  }

  getContainerModifierClass() {
    const statusToClassMap = {
      [ConnectionStatus.CONNECTED]: 'deviceSelector__main--connected',
      [ConnectionStatus.DISCONNECTED]: 'deviceSelector__main--disconnected',
      [ConnectionStatus.LOADING]: 'deviceSelector__main--loading',
    };
    return statusToClassMap[this.connectionStatus];
  }

  getListItemModifierClass(wledIpAddress: WLEDIpAddress) {
    return {
      'deviceSelector__listItem--connected': this.isSelectedWledIpAddress(wledIpAddress) && this.connectionStatus !== ConnectionStatus.DISCONNECTED,
      'deviceSelector__listItem--connectionError': this.isSelectedWledIpAddress(wledIpAddress) && this.connectionStatus === ConnectionStatus.DISCONNECTED,
    };
  }

  getOverlayPositions() {
    const centerPosition = this.overlayPositionService.centerBottomPosition();
    return [centerPosition];
  }

  private isSelectedWledIpAddress(wledIpAddress: WLEDIpAddress) {
    let isSelected = false;

    if (this.selectedWLEDIpAddress) {
      isSelected = wledIpAddress.name === this.selectedWLEDIpAddress.name &&
        wledIpAddress.ipv4Address === this.selectedWLEDIpAddress.ipv4Address;
    }

    return isSelected;
  }

  private handleTestIpAddressResponse(
    connectionStatus: ConnectionStatus,
    forceCloseList = false,
  ) {
    this.connectionStatus = connectionStatus;
    if (forceCloseList) {
      this.showList = false;
    }
    this.changeDetectorRef.markForCheck();
  }

  private openDeviceConnectSnackbar = (
    status: string,
    wledIpAddress: WLEDIpAddress,
  ) => {
    const message = `${status}: ${wledIpAddress.name} (${wledIpAddress.ipv4Address})`;
    this.snackbarService.openSnackBar(message);
  }
}
