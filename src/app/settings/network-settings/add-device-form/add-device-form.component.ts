import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { Observer } from 'rxjs';
import { ApiService } from '../../../shared/api.service';
import { NO_DEVICE_IP_SELECTED } from '../../../shared/app-state/app-state-defaults';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { WledIpAddress } from '../../../shared/app-types';
import { FormService } from '../../../shared/form-service';
import { UnsubscriberComponent } from '../../../shared/unsubscribing/unsubscriber.component';

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
export class AddDeviceFormComponent extends UnsubscriberComponent implements OnInit {
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
        this.updateFormValue(wledIpAddresses);
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

  saveWledIpAddresses() {
    if (!this.wledIpAddresses.valid) {
      alert('Please fix the error(s).');
      return;
    }

    const newIpAddresses = this.wledIpAddresses.value as WledIpAddress[];
    const selected = this.getSelected();
    if (selected) {
      // test IP address before saving it blindly
      const selectedWledIpAddress = selected.value as WledIpAddress;
      this.testIpAddress(selectedWledIpAddress.ipv4Address, {
        next: ({ success }) => {
          if (success) {
            this.appStateService.setLocalSettings({
              selectedWledIpAddress,
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
        selectedWledIpAddress: NO_DEVICE_IP_SELECTED,
        wledIpAddresses: newIpAddresses,
      });
    }
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

  private updateFormValue(wledIpAddresses: WledIpAddress[]) {
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
  }

  private getSelected() {
    const selected = this.wledIpAddresses.controls
      .find(({ value }) => value.selected);
    return selected;
  }
}
