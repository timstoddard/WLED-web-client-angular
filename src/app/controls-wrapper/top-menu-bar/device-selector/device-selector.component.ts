import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NO_DEVICE_IP_SELECTED } from '../../../shared/app-state/app-state-defaults';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { WLEDIpAddress } from '../../../shared/app-types/app-types';
import { OverlayPositionService } from '../../../shared/overlay-position.service';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { ConnectionStatus, SelectedDeviceService } from 'src/app/shared/selected-device.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device-selector',
  templateUrl: './device-selector.component.html',
  styleUrls: ['./device-selector.component.scss']
})
export class DeviceSelectorComponent extends UnsubscriberComponent implements OnInit {
  @Input() selectClass: string = '';
  wledIpAddresses!: WLEDIpAddress[];
  selectedWLEDIpAddress!: WLEDIpAddress;
  showList!: boolean;

  constructor(
    private appStateService: AppStateService,
    private changeDetectorRef: ChangeDetectorRef,
    private overlayPositionService: OverlayPositionService,
    private selectedDeviceService: SelectedDeviceService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.wledIpAddresses = [];
    this.selectedWLEDIpAddress = NO_DEVICE_IP_SELECTED;
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
    // trigger connecting animation on load
    if (this.wledIpAddresses.length >= 1) {
      let overriddenSelectedWLEDIpAddress = NO_DEVICE_IP_SELECTED;
      const queryParamIpAddress = this.route.snapshot.queryParamMap.get('ip')

      for (const wledIpAddress of this.wledIpAddresses) {
        if (wledIpAddress.ipv4Address === queryParamIpAddress) {
          overriddenSelectedWLEDIpAddress = wledIpAddress;
          break;
        }
      }

      this.selectedDeviceService.setSelectedDevice(
        overriddenSelectedWLEDIpAddress,
        () => this.changeDetectorRef.markForCheck(),
        () => this.changeDetectorRef.markForCheck(),
      );
    }
  }

  private handleConnectionTestResult(forceCloseList: boolean) {
    if (forceCloseList) {
      this.showList = false;
    }
    this.changeDetectorRef.markForCheck();
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

  setSelectedDevice(wledIpAddress: WLEDIpAddress) {
    this.selectedDeviceService.setSelectedDevice(
      wledIpAddress,
      () => this.handleConnectionTestResult(true),
      () => this.handleConnectionTestResult(false),
    );
  }

  handleAddLinkClick(event: Event) {
    event.stopImmediatePropagation();
    this.showList = false;
  }

  getContainerModifierClass() {
    const statusToClassMap = {
      [ConnectionStatus.CONNECTED]: 'deviceSelector__main--connected',
      [ConnectionStatus.DISCONNECTED]: 'deviceSelector__main--disconnected',
      [ConnectionStatus.CONNECTING]: 'deviceSelector__main--connecting',
    };
    return statusToClassMap[this.selectedDeviceService.getConnectionStatus()];
  }

  getListItemModifierClass(wledIpAddress: WLEDIpAddress) {
    const connectionStatus = this.selectedDeviceService.getConnectionStatus();
    if (!this.isSelectedWledIpAddress(wledIpAddress)) {
      return {};
    }
    return {
      'deviceSelector__listItem--connected': connectionStatus === ConnectionStatus.CONNECTED,
      'deviceSelector__listItem--loading': connectionStatus === ConnectionStatus.CONNECTING,
      'deviceSelector__listItem--connectionError': connectionStatus === ConnectionStatus.DISCONNECTED,
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
}
