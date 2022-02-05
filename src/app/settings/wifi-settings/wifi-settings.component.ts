import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {
    this.wifiSettingsForm = this.createForm();
  }

  ngOnInit() {
  }

  private createForm() {
    return this.formBuilder.group({
      localNetwork: this.formBuilder.group({
        ssid: this.formBuilder.control(''),
        password: this.formBuilder.control(''),
      }),
      IPAddress: this.formBuilder.group({
        // TODO add validators & text mask for IP inputs
        staticIP: this.formBuilder.control('', Validators.required),
        staticGateway: this.formBuilder.control('', Validators.required),
        staticSubnetMask: this.formBuilder.control('', Validators.required),
        mDNS: this.formBuilder.control(''),
      }),
      wledAccessPoint: this.formBuilder.group({
        ssid: this.formBuilder.control(''),
        password: this.formBuilder.control(''),
        hideAPName: this.formBuilder.control(false),
        wifiChannel: this.formBuilder.control(null, Validators.required),
        openAP: this.formBuilder.control(DEFAULT_OPEN_AP_OPTION),
      }),
      other: this.formBuilder.group({
        disableWifiSleep: this.formBuilder.control(false),
        ethernetTypes: this.formBuilder.control(DEFAULT_ETHERNET_TYPE),
      }),
    });
  }
}
