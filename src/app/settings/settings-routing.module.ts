import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RouteWithPageTitle } from '../shared/page-title.service';
import { DmxSettingsComponent } from './dmx-settings/dmx-settings.component';
import { LedSettingsComponent } from './led-settings/led-settings.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { SettingsComponent } from './settings.component';
import { SyncSettingsComponent } from './sync-settings/sync-settings.component';
import { TimeSettingsComponent } from './time-settings/time-settings.component';
import { UISettingsComponent } from './ui-settings/ui-settings.component';
import { UserModSettingsComponent } from './user-mod-settings/user-mod-settings.component';
import { WifiSettingsComponent } from './wifi-settings/wifi-settings.component';

// TODO page titles should match existing web app (?)
const routes: RouteWithPageTitle[] = [
  {
    path: '',
    component: SettingsComponent,
    data: { title: 'Settings' },
    children: [
      {
        path: 'dmx',
        component: DmxSettingsComponent,
        data: { title: 'DMX Settings' },
      },
      {
        path: 'leds',
        component: LedSettingsComponent,
        data: { title: 'LED Settings' },
      },
      {
        path: 'security',
        component: SecuritySettingsComponent,
        data: { title: 'Security Settings' },
      },
      {
        path: 'sync',
        component: SyncSettingsComponent,
        data: { title: 'Sync Settings' },
      },
      {
        path: 'time',
        component: TimeSettingsComponent,
        data: { title: 'Time Settings' },
      },
      {
        path: 'ui',
        component: UISettingsComponent,
        data: { title: 'UI Settings' },
      },
      {
        path: 'usermod',
        component: UserModSettingsComponent,
        data: { title: 'Usermod Settings' },
      },
      {
        path: 'wifi',
        component: WifiSettingsComponent,
        data: { title: 'Wifi Settings' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
