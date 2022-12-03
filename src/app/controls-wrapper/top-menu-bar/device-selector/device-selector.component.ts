import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../shared/api.service';
import { NO_DEVICE_IP_SELECTED } from '../../../shared/app-state/app-state-defaults';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { WLEDIpAddress } from '../../../shared/app-types';
import { OverlayPositionService } from '../../../shared/overlay-position.service';
import { UnsubscriberComponent } from '../../../shared/unsubscribing/unsubscriber.component';

type ConnectionStatus = 'connected' | 'disconnected' | 'loading';

@Component({
  selector: 'app-device-selector',
  templateUrl: './device-selector.component.html',
  styleUrls: ['./device-selector.component.scss']
})
export class DeviceSelectorComponent extends UnsubscriberComponent implements OnInit {
  @Input() selectClass: string = '';
  wledIpAddresses!: WLEDIpAddress[];
  selectedWLEDIpAddress!: WLEDIpAddress;
  connectionStatus!: ConnectionStatus | null;
  testIpAddressSubscription: Subscription | null = null;
  showList!: boolean;

  constructor(
    private appStateService: AppStateService,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private overlayPositionService: OverlayPositionService,
  ) {
    super();
  }

  ngOnInit() {
    this.wledIpAddresses = [];
    this.selectedWLEDIpAddress = NO_DEVICE_IP_SELECTED;
    this.connectionStatus = null;
    this.showList = false;

    this.appStateService.getLocalSettings(this.ngUnsubscribe)
      .subscribe(({
        selectedWLEDIpAddress,
        wledIpAddresses,
      }) => {
        this.wledIpAddresses = [
          NO_DEVICE_IP_SELECTED,
          ...wledIpAddresses,
        ];
        this.selectedWLEDIpAddress = selectedWLEDIpAddress;
      });
  }

  getSelectedDeviceName() {
    return this.selectedWLEDIpAddress.name === NO_DEVICE_IP_SELECTED.name
      ? 'Select Device'
      : this.selectedWLEDIpAddress.name;
  }

  setSelectedDevice = (wledIpAddress: WLEDIpAddress) => {
    console.log('selecting wledIpAddress:', wledIpAddress);
    this.appStateService.setSelectedWLEDIpAddress(wledIpAddress);

    // cancel any existing http call
    if (this.testIpAddressSubscription) {
      this.testIpAddressSubscription.unsubscribe();
      this.testIpAddressSubscription = null;
    }

    if (wledIpAddress.ipv4Address === NO_DEVICE_IP_SELECTED.ipv4Address) {
      this.handleTestIpAddressResponse(null, true);
    } else {
      this.connectionStatus = 'loading';
      const testIpAddress = this.apiService.testIpAddressAsBaseUrl(wledIpAddress.ipv4Address);
      this.testIpAddressSubscription = this.handleUnsubscribe(testIpAddress)
        .subscribe({
          next: (result) => {
            this.handleTestIpAddressResponse(
              result.success ? 'connected' : 'disconnected',
              result.success);
          },
          error: () => {
            this.handleTestIpAddressResponse('disconnected');
          }
        });
    }
  }

  getModifierClass() {
    const statusToClassMap = {
      'connected': 'deviceSelector__main--connected',
      'disconnected': 'deviceSelector__main--disconnected',
      'loading': 'deviceSelector__main--loading',
    };
    return this.connectionStatus !== null
      ? statusToClassMap[this.connectionStatus]
      : '';
  }

  getOverlayPositions() {
    const centerPosition = this.overlayPositionService.centerBottomPosition(0, 4);
    return [centerPosition];
  }

  private handleTestIpAddressResponse(
    connectionStatus: ConnectionStatus | null,
    forceCloseList = false,
  ) {
    this.testIpAddressSubscription = null;
    this.connectionStatus = connectionStatus;
    if (forceCloseList) {
      this.showList = false;
    }
    this.changeDetectorRef.markForCheck();
  }
}
