import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observer } from 'rxjs';
import { ApiService } from '../../../shared/api-service/api.service';
import { NO_DEVICE_IP_SELECTED } from '../../../shared/app-state/app-state-defaults';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { WLEDIpAddress } from '../../../shared/app-types/app-types';
import { FormService } from '../../../shared/form-service';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';

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
  devicePasswordInputConfigs: { [key: number]: InputConfig } = {};
  private selectedWLEDIpAddress!: WLEDIpAddress;

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
    this.generateInputConfigs();
  }

  // TODO show loading animation
  // TODO should allow multiple tests at once?
  testWLEDIpAddress(index: number) {
    // remove current index result, if it exists
    this.ipAddressTestResults = {
      ...this.ipAddressTestResults,
    };
    delete this.ipAddressTestResults[index];

    // test the provided IP address
    const wledIpAddress = this.wledIpAddresses.at(index);
    if (wledIpAddress) {
      const ipAddress = (wledIpAddress.value as SelectableWLEDIpAddress).ipv4Address;
      this.testIpAddress(ipAddress, {
        next: ({ success }) => {
          this.updateTestResultAtIndex(index, success);
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.updateTestResultAtIndex(index, false);
          this.changeDetectorRef.markForCheck();
        }
      });
    }
  }

  saveWLEDIpAddresses() {
    if (!this.wledIpAddresses.valid) {
      alert('Please fix the error(s).');
      return;
    }

    const newIpAddresses = this.wledIpAddresses.value as WLEDIpAddress[];
    const selected = this.getSelected();
    if (selected) {
      // test IP address before saving it blindly
      const selectedWLEDIpAddress = selected.value as WLEDIpAddress;
      this.testIpAddress(selectedWLEDIpAddress.ipv4Address, {
        next: ({ success }) => {
          if (success) {
            this.appStateService.setLocalSettings({
              selectedWLEDIpAddress,
              wledIpAddresses: newIpAddresses,
            });
            // TODO show messages in component/in snackbar instead of alerts
            alert('Selected device saved!');
          } else {
            alert('Network connection failed. Please select a different IP address.');
          }
        },
        error: () => {
          alert('Network connection failed. Please select a different IP address.');
        },
      })
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

  private testIpAddress(ipAddress: string, observer: Partial<Observer<{ success: boolean }>>) {
    this.handleUnsubscribe(this.apiService.testIpAddressAsBaseUrl(ipAddress))
      .subscribe(observer);
  }

  private updateTestResultAtIndex = (index: number, testResult: boolean) => {
    this.ipAddressTestResults = {
      ...this.ipAddressTestResults,
      [index]: testResult,
    };
  }

  private createForm() {
    return this.formService.formBuilder.array([
      this.createWLEDIpAddressGroup(),
    ]);
  }

  private createWLEDIpAddressGroup(values: SelectableWLEDIpAddress = {
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

  private updateFormValue(wledIpAddresses: WLEDIpAddress[]) {
    // wire up form logic
    this.wledIpAddresses.controls = [];
    for (const ipAddress of wledIpAddresses) {
      const selected = ipAddress.ipv4Address === this.selectedWLEDIpAddress.ipv4Address;
      const newFormGroup = this.createWLEDIpAddressGroup({
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
  }

  private getSelected() {
    const selected = this.wledIpAddresses.controls
      .find(({ value }) => value.selected);
    return selected;
  }

  private generateInputConfigs = () => {
    const deviceNameInputConfigs: { [key: number]: InputConfig } = {};
    const devicePasswordInputConfigs: { [key: number]: InputConfig } = {};

    const formGroups = this.getFormGroups();
    for (let i = 0; i < formGroups.length; i++) {
      deviceNameInputConfigs[i] = this.getDeviceNameInputConfig(i);
      devicePasswordInputConfigs[i] = this.getDevicePasswordInputConfig(i);
    }

    this.deviceNameInputConfigs = deviceNameInputConfigs;
    this.devicePasswordInputConfigs = devicePasswordInputConfigs;
  }

  private getDeviceNameInputConfig = (i: number): InputConfig => ({
    type: 'text',
    getFormControl: () => this.getFormControlAtIndex('name', i),
    placeholder: 'Name',
    widthPx: 150,
  });

  private getDevicePasswordInputConfig = (i: number): InputConfig => ({
    type: 'text',
    getFormControl: () => this.getFormControlAtIndex('ipv4Address', i),
    placeholder: 'Password',
    widthPx: 150,
  });
}
