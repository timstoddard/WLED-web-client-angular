import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormService, createGetFormControl, getFormControl, getFormControlFn } from '../../shared/form-service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { SelectItem } from '../shared/settings-types';
import { NetworkSettingsService } from './network-settings.service';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';
import { IPV4_ADDRESS_REGEX } from 'src/app/shared/common-regex';

const DEFAULT_ETHERNET_TYPE = 0;
const DEFAULT_OPEN_AP_OPTION = 0;

@Component({
  selector: 'app-network-settings',
  templateUrl: './network-settings.component.html',
  styleUrls: ['./network-settings.component.scss']
})
export class NetworkSettingsComponent extends UnsubscriberComponent implements OnInit {
  clientIpAddress = 'not active';
  wledAccessPointIpAddress = 'not active';
  openAPOptions: SelectItem<number>[] = [
    {
      name: 'No connection after boot',
      value: 0,
    },
    {
      name: 'Disconnected',
      value: 1,
    },
    {
      name: 'Always',
      value: 2,
    },
    {
      name: 'Never (not recommended)',
      value: 3,
    },
  ];
  ethernetTypes: SelectItem<number>[] = [
    {
      name: 'None',
      value: 0,
    },
    {
      name: 'ESP32-POE',
      value: 2,
    },
    {
      name: 'ESP32Deux',
      value: 6,
    },
    {
      name: 'QuinLED-ESP32',
      value: 4,
    },
    {
      name: 'TwilightLord-ESP32',
      value: 5,
    },
    {
      name: 'WESP32',
      value: 3,
    },
    {
      name: 'WT32-ETH01',
      value: 1,
    },
  ];

  networkSettingsForm!: FormGroup;
  hasEthernet: boolean = true; // TODO how to get this?
  getFormControl!: getFormControlFn;

  ssidInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.networkSettingsForm, 'localNetwork.ssid'),
    placeholder: 'Network name',
    widthPx: 180,
  };

  // ssidRequirements: FormControlRequirementConfig[] = [
  //   {
  //     path: ['localNetwork', 'ssid'],
  //     errorName: 'maxLength',
  //     description: 'Max length is 32',
  //   },
  // ];

  ssidPasswordInputConfig: InputConfig = {
    type: 'password',
    getFormControl: () => getFormControl(this.networkSettingsForm, 'localNetwork.password'),
    placeholder: 'Password',
    widthPx: 180,
  };

  staticIpInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.networkSettingsForm, 'localNetwork.staticIp'),
    placeholder: '000.000.000.000',
    widthPx: 150,
  };

  staticGatewayInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.networkSettingsForm, 'localNetwork.staticGateway'),
    placeholder: '000.000.000.000',
    widthPx: 150,
  };

  staticSubnetMaskInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.networkSettingsForm, 'localNetwork.staticSubnetMask'),
    placeholder: '000.000.000.000',
    widthPx: 150,
  };

  mDNSInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.networkSettingsForm, 'localNetwork.mDNS'),
    placeholder: 'wled-123',
    widthPx: 150,
  };

  apSSIDInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.networkSettingsForm, 'wledAccessPoint.ssid'),
    placeholder: 'Network name',
    widthPx: 150,
  };

  apPasswordInputConfig: InputConfig = {
    type: 'password',
    getFormControl: () => getFormControl(this.networkSettingsForm, 'wledAccessPoint.password'),
    placeholder: 'Password',
    widthPx: 150,
    pattern: '(.{8,63})|()',
  };

  apWifiChannelInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.networkSettingsForm, 'wledAccessPoint.wifiChannel'),
    placeholder: '',
    widthPx: 100,
    min: 1,
    max: 13,
  };

  constructor(
    private formService: FormService,
    private networkSettingsService: NetworkSettingsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.networkSettingsForm = this.createForm();
    this.getFormControl = createGetFormControl(this.networkSettingsForm);

    this.handleUnsubscribe(
      this.networkSettingsService.getParsedValues()
    ).subscribe(({ formValues, metadata }) => {
      console.log(' >>> WIFI formValues', formValues)
      console.log(' >>> WIFI metadata', metadata)
      this.networkSettingsForm.patchValue(formValues);
      if (metadata['clientIpAddress']) {
        this.clientIpAddress = metadata['clientIpAddress'] as string;
      }
      if (metadata['wledAccessPointIpAddress']) {
        this.wledAccessPointIpAddress = metadata['wledAccessPointIpAddress'] as string;
      }
      this.changeDetectorRef.markForCheck();
    })
  }

  submitForm() {
    const {
      localNetwork,
      ipAddress,
      wledAccessPoint,
      other,
    } = this.networkSettingsForm.value;

    // TODO move logic to service class
    const staticIpParts = ipAddress.staticIp.match(IPV4_ADDRESS_REGEX);
    const staticGatewayParts = ipAddress.staticGateway.match(IPV4_ADDRESS_REGEX);
    const staticSubnetMaskParts = ipAddress.staticSubnetMask.match(IPV4_ADDRESS_REGEX);

    const formValue: any /* TODO type */ = {
      I0: parseInt(staticIpParts[1], 10),
      I1: parseInt(staticIpParts[2], 10),
      I2: parseInt(staticIpParts[3], 10),
      I3: parseInt(staticIpParts[4], 10),
      G0: parseInt(staticGatewayParts[1], 10),
      G1: parseInt(staticGatewayParts[2], 10),
      G2: parseInt(staticGatewayParts[3], 10),
      G3: parseInt(staticGatewayParts[4], 10),
      S0: parseInt(staticSubnetMaskParts[1], 10),
      S1: parseInt(staticSubnetMaskParts[2], 10),
      S2: parseInt(staticSubnetMaskParts[3], 10),
      S3: parseInt(staticSubnetMaskParts[4], 10),
      CM: ipAddress.mDNS,
      AS: wledAccessPoint.ssid,
      AP: wledAccessPoint.password,
      // TODO server checks for existence not truthiness
      AH: wledAccessPoint.hideAPName ? true : undefined,
      AC: wledAccessPoint.wifiChannel,
      AB: wledAccessPoint.openAP,
      // TODO server checks for existence not truthiness 
      WS: other.disableWifiSleep ? true : undefined,
      ETH: other.ethernetType,
    };

    if (localNetwork.ssid && localNetwork.password) {
      formValue.CS = localNetwork.ssid;
      formValue.CP = localNetwork.password;
    }

    console.log(formValue);
    this.handleUnsubscribe(
      this.networkSettingsService.setNetworkSettings(formValue));
    // TODO redirect
  }

  private createForm() {
    // TODO use formService.createFormGroup()

    // TODO get default values from server/api (is this currently possible? existing website has them hardcoded into the html)

    // TODO add validators for IP address controls
    return this.formService.formBuilder.group({
      localNetwork: this.formService.formBuilder.group({
        ssid: this.formService.formBuilder.control('', Validators.maxLength(32)),
        // TODO how is password handled server side?
        password: this.formService.formBuilder.control('', Validators.maxLength(63)),
        // TODO add validators & text mask for IP inputs
        staticIp: this.formService.formBuilder.control('0.0.0.0', Validators.required),
        staticGateway: this.formService.formBuilder.control('0.0.0.0', Validators.required),
        staticSubnetMask: this.formService.formBuilder.control('255.255.255.0', Validators.required),
        // TODO better default?
        mDNS: this.formService.formBuilder.control('wled-55a9b0', Validators.maxLength(32)),
      }),
      wledAccessPoint: this.formService.formBuilder.group({
        ssid: this.formService.formBuilder.control('WLED-AP', Validators.maxLength(32)),
        // TODO better default? how is asterisk password handled server side?
        password: this.formService.formBuilder.control('********', Validators.maxLength(63)),
        hideAPName: this.formService.formBuilder.control(false),
        wifiChannel: this.formService.formBuilder.control(1, Validators.required),
        openAP: this.formService.formBuilder.control(DEFAULT_OPEN_AP_OPTION),
      }),
      advanced: this.formService.formBuilder.group({
        disableWifiSleep: this.formService.formBuilder.control(true),
        ethernetType: this.formService.formBuilder.control(DEFAULT_ETHERNET_TYPE),
      }),
    });
  }
}
