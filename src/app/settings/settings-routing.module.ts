import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DmxSettingsComponent } from './dmx-settings/dmx-settings.component';
import { LedSettingsComponent } from './led-settings/led-settings.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { SettingsComponent } from './settings.component';
import { SyncSettingsComponent } from './sync-settings/sync-settings.component';
import { TimeSettingsComponent } from './time-settings/time-settings.component';
import { UISettingsComponent } from './ui-settings/ui-settings.component';
import { UserModSettingsComponent } from './user-mod-settings/user-mod-settings.component';
import { WifiSettingsComponent } from './wifi-settings/wifi-settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: 'dmx', component: DmxSettingsComponent },
      { path: 'leds', component: LedSettingsComponent },
      { path: 'security', component: SecuritySettingsComponent },
      { path: 'sync', component: SyncSettingsComponent },
      { path: 'time', component: TimeSettingsComponent },
      { path: 'ui', component: UISettingsComponent },
      { path: 'usermod', component: UserModSettingsComponent },
      { path: 'wifi', component: WifiSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
