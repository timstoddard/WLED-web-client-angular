import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
export class WifiSettingsComponent implements OnInit {
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

  wifiSettingsForm: FormGroup;

  constructor() {
    this.wifiSettingsForm = this.createForm();
  }

  ngOnInit() {
  }

  private createForm() {
    return new FormGroup({
      localNetwork: new FormGroup({
        ssid: new FormControl(''),
        password: new FormControl(''),
      }),
      IPAddress: new FormGroup({
        staticIP: new FormControl(''),
        staticGateway: new FormControl(''),
        staticSubnetMask: new FormControl(''),
        mDNS: new FormControl(''),
      }),
      wledAccessPoint: new FormGroup({
        ssid: new FormControl(''),
        password: new FormControl(''),
        hideAPName: new FormControl(false),
        wifiChannel: new FormControl(null),
        openAP: new FormControl(DEFAULT_OPEN_AP_OPTION),
      }),
      other: new FormGroup({
        disableWifiSleep: new FormControl(false),
        ethernetTypes: new FormControl(DEFAULT_ETHERNET_TYPE),
      }),
    });
  }
}
