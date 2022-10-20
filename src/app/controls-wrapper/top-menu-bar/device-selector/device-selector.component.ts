import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../shared/api.service';
import { NO_DEVICE_IP_SELECTED } from '../../../shared/app-state/app-state-defaults';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { WledIpAddress } from '../../../shared/app-types';
import { FormService } from '../../../shared/form-service';
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
  selectedWledIpAddress!: FormControl;
  connectionStatus!: ConnectionStatus | null;

  constructor(
    private appStateService: AppStateService,
    private formService: FormService,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.wledIpAddresses = [];
    this.selectedWledIpAddress = this.createControl();
    this.connectionStatus = null;
    this.handleUnsubscribe(this.selectedWledIpAddress.valueChanges)
      .subscribe(this.setSelectedDevice);

    this.appStateService.getLocalSettings(this.ngUnsubscribe)
      .subscribe(({
        selectedWledIpAddress,
        wledIpAddresses,
      }) => {
        this.wledIpAddresses = [
          NO_DEVICE_IP_SELECTED,
          ...wledIpAddresses,
        ];
        this.selectedWledIpAddress.patchValue(selectedWledIpAddress.ipv4Address, { emitEvent: false });
      });
  }

  getModifierClass() {
    switch (this.connectionStatus) {
      case 'connected':
        return 'deviceSelector--connected';
      case 'disconnected':
        return 'deviceSelector--disconnected';
      case 'loading':
        return 'deviceSelector--loading';
      default:
        return '';
    }
  }

  private createControl() {
    return this.formService.createFormControl('');
  }

  private setSelectedDevice = (ipAddress: string) => {
    const name = this.wledIpAddresses
      .find(({ ipv4Address }) => ipv4Address === ipAddress)!
      .name;
    console.log('wledIpAddress', { name, ipAddress });
    if (ipAddress === NO_DEVICE_IP_SELECTED.ipv4Address) {
      // 'None' selected
      this.connectionStatus = null;
      this.appStateService.setSelectedWledIpAddress(NO_DEVICE_IP_SELECTED);
    } else {
      this.connectionStatus = 'loading';
      // test ip address as base url before setting
      this.handleUnsubscribe(this.apiService.testIpAddressAsBaseUrl(ipAddress))
        .subscribe({
          next: (result) => {
            if (result.success) {
              this.connectionStatus = 'connected';
              this.appStateService.setSelectedWledIpAddress({
                name,
                ipv4Address: ipAddress,
              });
            } else {
              this.connectionStatus = 'disconnected';
              this.changeDetectorRef.markForCheck();
            }
          },
          error: () => {
            this.connectionStatus = 'disconnected';
            this.changeDetectorRef.markForCheck();
          }
        });
    }
  }
}
