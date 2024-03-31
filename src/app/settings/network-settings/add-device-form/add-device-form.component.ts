import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NO_DEVICE_IP_SELECTED } from '../../../shared/app-state/app-state-defaults';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { WLEDIpAddress } from '../../../shared/app-types/app-types';
import { FormService } from '../../../shared/form-service';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { SelectedDeviceService } from 'src/app/shared/selected-device.service';
import { IPV4_ADDRESS_OR_HOSTNAME_REGEX } from 'src/app/shared/common-regex';

interface SelectableWLEDIpAddress extends WLEDIpAddress {
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
export class AddDeviceFormComponent extends UnsubscriberComponent implements OnInit {
  wledIpAddresses!: FormArray;
  ipAddressTestResults!: IpAddressTestResults;
  deviceNameInputConfigs: { [key: number]: InputConfig } = {};
  deviceIpAddressInputConfigs: { [key: number]: InputConfig } = {};
  private selectedWLEDIpAddress!: WLEDIpAddress;

  constructor(
    private appStateService: AppStateService,
    private formService: FormService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackbarService: SnackbarService,
    private selectedDeviceService: SelectedDeviceService,
  ) {
    super();
  }

  ngOnInit() {
    this.wledIpAddresses = this.createForm();
    this.ipAddressTestResults = {};

    this.appStateService.getLocalSettings(this.ngUnsubscribe)
      .subscribe(({
        selectedWLEDIpAddress,
        wledIpAddresses,
      }) => {
        this.selectedWLEDIpAddress = selectedWLEDIpAddress;
        this.updateFormValue(wledIpAddresses);
        this.generateInputConfigs();
      });
  }

  getFormGroups() {
    return this.wledIpAddresses.controls as FormGroup[];
  }

  addWLEDIpAddress() {
    this.wledIpAddresses.push(this.createWLEDIpAddressGroup());
    this.generateInputConfigs();
  }

  removeWLEDIpAddress(removeIndex: number) {
    this.wledIpAddresses.removeAt(removeIndex);

    // if the removed was current selected, update current selected to first in list
    if (!this.getSelectedIpAddress()) {
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
    this.generateInputConfigs();
  }

  // TODO show loading animation
  // TODO should allow multiple tests at once? (is it possible?)
  testWLEDIpAddress(index: number) {
    // remove current index result, if it exists
    this.ipAddressTestResults = {
      ...this.ipAddressTestResults,
    };
    delete this.ipAddressTestResults[index];

    // test the provided IP address
    const wledIpAddress = this.wledIpAddresses.at(index);
    if (wledIpAddress) {
      const wledIpAddressValue = wledIpAddress.value as SelectableWLEDIpAddress;
      this.selectedDeviceService.testConnectToDeviceIpAddress(
        wledIpAddressValue,
        false,
        () => this.updateTestResultAtIndex(index, true),
        () => this.updateTestResultAtIndex(index, false),
      );
    }
  }

  saveWLEDIpAddresses() {
    if (!this.wledIpAddresses.valid) {
      alert('Please fix the IP address validation error(s).');
      return;
    }

    const newIpAddresses = this.wledIpAddresses.value as WLEDIpAddress[];
    const selected = this.getSelectedIpAddress();
    if (selected) {
      // test IP address to make sure it works before saving
      const selectedWLEDIpAddress = selected.value as WLEDIpAddress;
      this.selectedDeviceService.testConnectToDeviceIpAddress(
        selectedWLEDIpAddress,
        true,
        () => {
          this.appStateService.setLocalSettings({
            selectedWLEDIpAddress,
            wledIpAddresses: newIpAddresses,
          });
        },
        this.handleFailedNetworkConnection,
      );
    } else {
      this.appStateService.setLocalSettings({
        selectedWLEDIpAddress: NO_DEVICE_IP_SELECTED,
        wledIpAddresses: newIpAddresses,
      });
    }
  }

  getFormControlAtIndex(name: string, index: number) {
    return this.wledIpAddresses.at(index).get(name) as FormControl;
  }

  private updateTestResultAtIndex = (index: number, testResult: boolean) => {
    this.ipAddressTestResults = {
      ...this.ipAddressTestResults,
      [index]: testResult,
    };
    this.changeDetectorRef.markForCheck();
  }

  private createForm() {
    return this.formService.createFormArray([
      this.createWLEDIpAddressGroup(),
    ]);
  }

  private createWLEDIpAddressGroup(values: SelectableWLEDIpAddress = {
    selected: false,
    name: '',
    ipv4Address: '',
  }) {
    const formGroup = this.formService.createFormGroup({
      selected: values.selected,
      name: values.name,
      ipv4Address: values.ipv4Address,
    });
    formGroup.get('ipv4Address')!.addValidators(Validators.pattern(IPV4_ADDRESS_OR_HOSTNAME_REGEX));

    // when one is selected, unselect all others
    this.getValueChanges<boolean>(formGroup, 'selected')
      .subscribe((isSelected: boolean) => {
        if (isSelected) {
          for (const wledIpAddressControl of this.wledIpAddresses.controls) {
            if (wledIpAddressControl !== formGroup) {
              wledIpAddressControl.patchValue({ selected: false }, { emitEvent: false });
            }
          }
        }
      });

    // TODO add validator to check for duplicate names or IP addresses

    return formGroup;
  }

  private updateFormValue(wledIpAddresses: WLEDIpAddress[]) {
    // wire up form logic
    this.wledIpAddresses.controls = [];
    for (const ipAddress of wledIpAddresses) {
      const selected = ipAddress.ipv4Address === this.selectedWLEDIpAddress.ipv4Address;
      const newFormGroup = this.createWLEDIpAddressGroup({
        selected,
        ...ipAddress,
      });
      this.wledIpAddresses.push(newFormGroup);
    }
  }

  private getSelectedIpAddress = () => {
    const selected = this.wledIpAddresses.controls
      .find(({ value }) => value.selected);
    return selected;
  }

  private handleFailedNetworkConnection = () => {
    this.snackbarService.openSnackBar('Network connection failed. Please try a different IP address.');
  };

  private generateInputConfigs = () => {
    const deviceNameInputConfigs: { [key: number]: InputConfig } = {};
    const deviceIpAddressInputConfigs: { [key: number]: InputConfig } = {};

    const formGroups = this.getFormGroups();
    for (let i = 0; i < formGroups.length; i++) {
      deviceNameInputConfigs[i] = this.getDeviceNameInputConfig(i);
      deviceIpAddressInputConfigs[i] = this.getDeviceIpAddressInputConfigs(i);
    }

    this.deviceNameInputConfigs = deviceNameInputConfigs;
    this.deviceIpAddressInputConfigs = deviceIpAddressInputConfigs;
  }

  private getDeviceNameInputConfig = (i: number): InputConfig => ({
    type: 'text',
    getFormControl: () => this.getFormControlAtIndex('name', i),
    placeholder: 'Name',
    widthPx: 150,
  });

  private getDeviceIpAddressInputConfigs = (i: number): InputConfig => ({
    type: 'text',
    getFormControl: () => this.getFormControlAtIndex('ipv4Address', i),
    placeholder: '0.0.0.0',
    widthPx: 150,
  });
}
