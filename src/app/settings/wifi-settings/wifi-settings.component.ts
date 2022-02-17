import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { WifiSettingsService } from './wifi-settings.service';

interface SelectItem {
  name: string;
  value: number;
}

const DEFAULT_ETHERNET_TYPE = 0;
const DEFAULT_OPEN_AP_OPTION = 0;

@Component({
  selector: 'app-wifi-settings',
  templateUrl: './wifi-settings.component.html',
  styleUrls: ['./wifi-settings.component.scss']
})
export class WifiSettingsComponent extends UnsubscribingComponent implements OnInit {
  openAPOptions: SelectItem[] = [
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
  ethernetTypes: SelectItem[] = [
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

  wifiSettingsForm!: FormGroup;
  hasEthernet: boolean = true; // TODO how to get this?

  constructor(
    private formBuilder: FormBuilder,
    private wifiSettingsService: WifiSettingsService,
  ) {
    super();
  }

  ngOnInit() {
    this.wifiSettingsForm = this.createForm();
  }

  submitForm() {
    const {
      localNetwork,
      ipAddress,
      wledAccessPoint,
      other,
    } = this.wifiSettingsForm.value;

    const ipAddressRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const staticIpParts = ipAddress.staticIp.match(ipAddressRegex);
    const staticGatewayParts = ipAddress.staticGateway.match(ipAddressRegex);
    const staticSubnetMaskParts = ipAddress.staticSubnetMask.match(ipAddressRegex);

    const formValues: any /* TODO type */ = {
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
      AH: wledAccessPoint.hideAPName,
      AC: wledAccessPoint.wifiChannel,
      AB: wledAccessPoint.openAP,
      WS: other.disableWifiSleep,
      ETH: other.ethernetType,
    };

    if (localNetwork.ssid && localNetwork.password) {
      formValues.CS = localNetwork.ssid;
      formValues.CP = localNetwork.password;
    }

    console.log(formValues);
    this.wifiSettingsService.setWifiSettings(formValues)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(n => {
        // TODO why doesnt this log anything?
        console.log(n)
      });
  }

  private createForm() {
    // TODO get default values from server/api (is this currently possible? existing website has them hardcoded into the html)
    return this.formBuilder.group({
      localNetwork: this.formBuilder.group({
        ssid: this.formBuilder.control(''),
        // TODO how is password handled server side?
        password: this.formBuilder.control(''),
      }),
      ipAddress: this.formBuilder.group({
        // TODO add validators & text mask for IP inputs
        staticIp: this.formBuilder.control('0.0.0.0', Validators.required),
        staticGateway: this.formBuilder.control('0.0.0.0', Validators.required),
        staticSubnetMask: this.formBuilder.control('255.255.255.0', Validators.required),
        // TODO better default?
        mDNS: this.formBuilder.control('wled-55a9b0'),
      }),
      wledAccessPoint: this.formBuilder.group({
        ssid: this.formBuilder.control('WLED-AP'),
        // TODO better default? how is asterisk password handled server side?
        password: this.formBuilder.control('********'),
        hideAPName: this.formBuilder.control(false),
        wifiChannel: this.formBuilder.control(1, Validators.required),
        openAP: this.formBuilder.control(DEFAULT_OPEN_AP_OPTION),
      }),
      other: this.formBuilder.group({
        disableWifiSleep: this.formBuilder.control(true),
        ethernetType: this.formBuilder.control(DEFAULT_ETHERNET_TYPE),
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
