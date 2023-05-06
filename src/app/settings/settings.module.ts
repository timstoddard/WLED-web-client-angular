import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AddDeviceFormComponent } from './network-settings/add-device-form/add-device-form.component';
import { DmxSettingsComponent } from './dmx-settings/dmx-settings.component';
import { ExternalLinkComponent } from '../shared/external-link/external-link.component';
import { LedSettingsComponent } from './led-settings/led-settings.component';
import { NetworkSettingsComponent } from './network-settings/network-settings.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { SettingsComponent } from './settings.component';
import { SettingsFooterComponent } from './shared/settings-footer/settings-footer.component';
import { SettingsGroupComponent } from './shared/settings-group/settings-group.component';
import { SettingsHeaderComponent } from './shared/settings-header/settings-header.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { SyncSettingsComponent } from './sync-settings/sync-settings.component';
import { TimeSettingsComponent } from './time-settings/time-settings.component';
import { UISettingsComponent } from './ui-settings/ui-settings.component';
import { UserModSettingsComponent } from './user-mod-settings/user-mod-settings.component';

const COMPONENTS = [
  AddDeviceFormComponent,
  DmxSettingsComponent,
  // TODO share with controls module and/or app module?
  ExternalLinkComponent,
  LedSettingsComponent,
  NetworkSettingsComponent,
  SecuritySettingsComponent,
  SettingsComponent,
  SettingsFooterComponent,
  SettingsGroupComponent,
  SettingsHeaderComponent,
  SyncSettingsComponent,
  TimeSettingsComponent,
  UISettingsComponent,
  UserModSettingsComponent,
];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    SharedComponentsModule,
  ]
})
export class SettingsModule { }
