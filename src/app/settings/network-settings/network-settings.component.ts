import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { AppStateService, WledIpAddress } from '../../shared/app-state/app-state.service';
import { FormService } from '../../shared/form-utils';
import { UnsubscribingComponent } from '../../shared/unsubscribing/unsubscribing.component';
import { SelectItem } from '../shared/settings-types';
import { NetworkSettingsService } from './network-settings.service';

const DEFAULT_ETHERNET_TYPE = 0;
const DEFAULT_OPEN_AP_OPTION = 0;

@Component({
  selector: 'app-network-settings',
  templateUrl: './network-settings.component.html',
  styleUrls: ['./network-settings.component.scss']
})
export class NetworkSettingsComponent extends UnsubscribingComponent implements OnInit {
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

  constructor(
    private formService: FormService,
    private networkSettingsService: NetworkSettingsService,
  ) {
    super();
  }

  ngOnInit() {
    this.networkSettingsForm = this.createForm();
  }

  submitForm() {
    const {
      localNetwork,
      ipAddress,
      wledAccessPoint,
      other,
    } = this.networkSettingsForm.value;


    // TODO move logic to service class
    const ipAddressRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const staticIpParts = ipAddress.staticIp.match(ipAddressRegex);
    const staticGatewayParts = ipAddress.staticGateway.match(ipAddressRegex);
    const staticSubnetMaskParts = ipAddress.staticSubnetMask.match(ipAddressRegex);

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
      this.networkSettingsService.setWifiSettings(formValue));
    // TODO redirect
  }

  private createForm() {
    // TODO use formService.createFormGroup()

    // TODO get default values from server/api (is this currently possible? existing website has them hardcoded into the html)

    return this.formService.formBuilder.group({
      localNetwork: this.formService.formBuilder.group({
        ssid: this.formService.formBuilder.control(''),
        // TODO how is password handled server side?
        password: this.formService.formBuilder.control(''),
        ipAddress: this.formService.formBuilder.group({
          // TODO add validators & text mask for IP inputs
          staticIp: this.formService.formBuilder.control('0.0.0.0', Validators.required),
          staticGateway: this.formService.formBuilder.control('0.0.0.0', Validators.required),
          staticSubnetMask: this.formService.formBuilder.control('255.255.255.0', Validators.required),
          // TODO better default?
          mDNS: this.formService.formBuilder.control('wled-55a9b0'),
        }),
      }),
      wledAccessPoint: this.formService.formBuilder.group({
        ssid: this.formService.formBuilder.control('WLED-AP'),
        // TODO better default? how is asterisk password handled server side?
        password: this.formService.formBuilder.control('********'),
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

/*
function GetV() {
  var d=document;
  d.Sf.CS.value="10010000101";
  d.Sf.CP.value="*************";
  d.Sf.I0.value=0;
  d.Sf.G0.value=0;
  d.Sf.S0.value=255;
  d.Sf.I1.value=0;
  d.Sf.G1.value=0;
  d.Sf.S1.value=255;
  d.Sf.I2.value=0;
  d.Sf.G2.value=0;
  d.Sf.S2.value=255;
  d.Sf.I3.value=0;
  d.Sf.G3.value=0;
  d.Sf.S3.value=0;
  d.Sf.CM.value="wled-55a9b0";
  d.Sf.AB.selectedIndex=0;
  d.Sf.AS.value="WLED-AP";
  d.Sf.AH.checked=0;
  d.Sf.AP.value="********";
  d.Sf.AC.value=1;
  d.Sf.WS.checked=1;
  document.getElementById('ethd').style.display='none';

  // TODO get these from api (is that possible?)
  d.getElementsByClassName("sip")[0].innerHTML="192.168.100.154";
  d.getElementsByClassName("sip")[1].innerHTML="4.3.2.1";
}
*/
