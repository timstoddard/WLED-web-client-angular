import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { NO_DEVICE_IP_SELECTED } from '../../../controls-wrapper/top-menu-bar/device-selector/device-selector.component';
import { ApiService } from '../../../shared/api.service';
import { AppLocalSettings, AppStateService, WledIpAddress } from '../../../shared/app-state/app-state.service';
import { FormService } from '../../../shared/form-utils';
import { UnsubscribingComponent } from '../../../shared/unsubscribing/unsubscribing.component';

interface SelectableWledIpAddress extends WledIpAddress {
  selected: boolean;
}

interface IpAddressTestResults {
  [key: number]: boolean;
}

@Component({
  selector: 'app-add-device-form',
  templateUrl: './add-device-form.component.html',
  styleUrls: ['./add-device-form.component.scss']
})
export class AddDeviceFormComponent extends UnsubscribingComponent implements OnInit {
  wledIpAddresses!: FormArray;
  ipAddressTestResults!: IpAddressTestResults;
  private selectedWledIpAddress!: WledIpAddress;

  constructor(
    private appStateService: AppStateService,
    private formService: FormService,
    // TODO put in service class?
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.wledIpAddresses = this.createForm();
    this.ipAddressTestResults = {};

    this.appStateService.getLocalSettings(this.ngUnsubscribe)
      .subscribe(({
        selectedWledIpAddress,
        wledIpAddresses,
      }) => {
        this.selectedWledIpAddress = selectedWledIpAddress;

        // wire up form logic
        this.wledIpAddresses.controls = [];
        for (const ipAddress of wledIpAddresses) {
          const selected = ipAddress.ipv4Address === this.selectedWledIpAddress.ipv4Address;
          const newFormGroup = this.createWledIpAddressGroup({
            selected,
            ...ipAddress,
          });
          // when one is selected, unselect all others
          this.getValueChanges(newFormGroup, 'selected')
            .subscribe((isSelected) => {
              if (isSelected) {
                for (const formGroup of this.wledIpAddresses.controls) {
                  if (formGroup !== newFormGroup) {
                    formGroup.patchValue({ selected: false }, { emitEvent: false });
                  }
                }
              }
            });
          this.wledIpAddresses.push(newFormGroup);
        }
      });
  }

  getFormGroups() {
    return this.wledIpAddresses.controls as FormGroup[];
  }

  addWledIpAddress() {
    this.wledIpAddresses.push(this.createWledIpAddressGroup());
  }

  removeWledIpAddress(removeIndex: number) {
    this.wledIpAddresses.removeAt(removeIndex);

    // if the removed was current selected, update current selected to first in list
    if (!this.getSelected()) {
      this.wledIpAddresses.at(0)?.patchValue({ selected: true });
    }

    // shift all test results (after the removed) down by 1
    const updatedTestResults: IpAddressTestResults = {}
    for (const index in this.ipAddressTestResults) {
      const numIndex = parseInt(index, 10);
      if (numIndex !== removeIndex) {
        const newKey = numIndex > removeIndex
         ? numIndex - 1
        : numIndex;
        updatedTestResults[newKey] = this.ipAddressTestResults[index];
      }
    }
    this.ipAddressTestResults = updatedTestResults;
  }

  // TODO show loading animation
  // TODO should allow multiple tests at once?
  testWledIpAddress(index: number) {
    // remove current index result, if it exists
    this.ipAddressTestResults = {
      ...this.ipAddressTestResults,
    };
    delete this.ipAddressTestResults[index];

    // test the provided IP address
    const wledIpAddress = this.wledIpAddresses.at(index);
    if (wledIpAddress) {
      const ipAddress = (wledIpAddress.value as SelectableWledIpAddress).ipv4Address;
      this.handleUnsubscribe(this.apiService.testIpAddressAsBaseUrl(ipAddress))
        .subscribe(result => {
          this.ipAddressTestResults = {
            ...this.ipAddressTestResults,
            [index]: result.success,
          };
          this.changeDetectorRef.markForCheck();
        });
    }
  }

  saveWledIpAddresses() {
    if (!this.wledIpAddresses.valid) {
      // TODO user alert?
      return;
    }

    const newIpAddresses = this.wledIpAddresses.value as WledIpAddress[];
    const selected = this.getSelected();
    const selectedWledIpAddress = selected
      ? selected.value as WledIpAddress
      : NO_DEVICE_IP_SELECTED;
    this.appStateService.setLocalSettings({
      selectedWledIpAddress,
      wledIpAddresses: newIpAddresses,
    });
  }

  private createForm() {
    return this.formService.formBuilder.array([
      this.createWledIpAddressGroup(),
    ]);
  }

  private createWledIpAddressGroup(values: SelectableWledIpAddress = {
    selected: false,
    name: '',
    ipv4Address: '',
  }) {
    const IP_ADDRESS_REGEX = new Array(4).fill('\\d{1,3}').join('\\.');
    const formGroup = this.formService.createFormGroup({
      selected: values.selected,
      name: values.name,
      ipv4Address: values.ipv4Address,
    });
    formGroup.get('ipv4Address')!.addValidators(Validators.pattern(IP_ADDRESS_REGEX));
    return formGroup;
  }

  private getSelected() {
    const selected = this.wledIpAddresses.controls
      .find(({ value }) => value.selected);
    return selected;
  }
}
