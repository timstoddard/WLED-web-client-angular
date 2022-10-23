import { OriginConnectionPosition, OverlayConnectionPosition, ConnectionPositionPair } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../shared/api.service';
import { NO_DEVICE_IP_SELECTED } from '../../../shared/app-state/app-state-defaults';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { WledIpAddress } from '../../../shared/app-types';
import { UnsubscriberComponent } from '../../../shared/unsubscribing/unsubscriber.component';

type ConnectionStatus = 'connected' | 'disconnected' | 'loading';

@Component({
  selector: 'app-device-selector',
  templateUrl: './device-selector.component.html',
  styleUrls: ['./device-selector.component.scss']
})
export class DeviceSelectorComponent extends UnsubscriberComponent implements OnInit {
  @Input() selectClass: string = '';
  wledIpAddresses!: WledIpAddress[];
  selectedWledIpAddress!: WledIpAddress;
  connectionStatus!: ConnectionStatus | null;
  testIpAddressSubscription: Subscription | null = null;
  showList!: boolean;

  constructor(
    private appStateService: AppStateService,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.wledIpAddresses = [];
    this.selectedWledIpAddress = NO_DEVICE_IP_SELECTED;
    this.connectionStatus = null;
    this.showList = false;

    this.appStateService.getLocalSettings(this.ngUnsubscribe)
      .subscribe(({
        selectedWledIpAddress,
        wledIpAddresses,
      }) => {
        this.wledIpAddresses = [
          NO_DEVICE_IP_SELECTED,
          ...wledIpAddresses,
        ];
        this.selectedWledIpAddress = selectedWledIpAddress;
      });
  }

  getSelectedDeviceName() {
    return this.selectedWledIpAddress.name === NO_DEVICE_IP_SELECTED.name
      ? 'Select Device'
      : this.selectedWledIpAddress.name;
  }

  setSelectedDevice = (wledIpAddress: WledIpAddress) => {
    console.log('selecting wledIpAddress:', wledIpAddress);
    this.appStateService.setSelectedWledIpAddress(wledIpAddress);

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

  private handleTestIpAddressResponse(
    connectionStatus: ConnectionStatus | null,
    forceCloseList = false,
  ) {
    this.testIpAddressSubscription = null;
    if (forceCloseList) {
      this.showList = false;
    }
    this.connectionStatus = connectionStatus;
    this.changeDetectorRef.markForCheck();
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
    const OFFSET_X_PX = 0;
    const OFFSET_Y_PX = 3;
    const originCenterBottom: OriginConnectionPosition = {
      originX: 'center',
      originY: 'bottom',
    };
    const overlayCenterTop: OverlayConnectionPosition = {
      overlayX: 'center',
      overlayY: 'top',
    };
    const centerPosition = new ConnectionPositionPair(originCenterBottom, overlayCenterTop, OFFSET_X_PX, OFFSET_Y_PX);
    return [centerPosition];
  }
}
