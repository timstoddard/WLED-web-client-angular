import { Component } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  links = [
    // most common
    {
      path: 'leds',
      name: 'Leds & Hardware',
    },
    {
      path: 'network',
      name: 'Network',
    },

    // semi common
    {
      path: 'sync',
      name: 'Synced Devices',
    },
    {
      path: 'security',
      name: 'Security',
    },
    {
      path: 'ui',
      name: 'UI',
    },
    {
      path: 'time',
      name: 'Time',
    },

    // less common
    {
      path: 'dmx',
      name: 'DMX',
    },
    {
      path: 'usermod',
      name: 'User Mods',
    },
  ];

  closeDrawer(drawer: MatDrawer) {
    drawer.close();
  }

  onLinkClick(drawer: MatDrawer, event: MouseEvent) {
    // prevent drawer from handling this click
    event.stopImmediatePropagation();
    event.stopPropagation();

    this.closeDrawer(drawer);
  }
}
