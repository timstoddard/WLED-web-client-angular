import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DmxSettingsComponent } from './dmx-settings/dmx-settings.component';
import { LedSettingsComponent } from './led-settings/led-settings.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SyncSettingsComponent } from './sync-settings/sync-settings.component';
import { TimeSettingsComponent } from './time-settings/time-settings.component';
import { UISettingsComponent } from './ui-settings/ui-settings.component';
import { UserModSettingsComponent } from './user-mod-settings/user-mod-settings.component';
import { WifiSettingsComponent } from './wifi-settings/wifi-settings.component';

const COMPONENTS = [
  SettingsComponent,
  DmxSettingsComponent,
  LedSettingsComponent,
  SecuritySettingsComponent,
  SyncSettingsComponent,
  TimeSettingsComponent,
  UISettingsComponent,
  UserModSettingsComponent,
  WifiSettingsComponent,
];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [
    CommonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
  ]
})
export class SettingsModule { }
