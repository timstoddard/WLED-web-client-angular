import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  links = [
    { path: 'dmx', component: 'DmxSettings' },
    { path: 'leds', component: 'LedSettings' },
    { path: 'security', component: 'SecuritySettings' },
    { path: 'sync', component: 'SyncSettings' },
    { path: 'time', component: 'TimeSettings' },
    { path: 'ui', component: 'UISettings' },
    { path: 'usermod', component: 'UserModSettings' },
    { path: 'wifi', component: 'WifiSettings' },
  ];

  constructor() { }

  ngOnInit() {
  }
}
