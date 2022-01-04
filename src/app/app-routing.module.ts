import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ControlsComponent } from './controls/controls.component';
import { DmxMapComponent } from './dmx-map/dmx-map.component';
import { EditComponent } from './edit/edit.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QuickStatsComponent } from './quick-stats/quick-stats.component';
import { ResetComponent } from './reset/reset.component';
import { TeapotComponent } from './teapot/teapot.component';
import { UpdateComponent } from './update/update.component';
import { UserModPageComponent } from './user-mod-page/user-mod-page.component';
import { WelcomeComponent } from './welcome/welcome.component';

// TODO page titles should match existing web app
const routes: Routes = [
  {
    path: 'controls', // also keep /sliders?
    component: ControlsComponent,
    data: { title: 'WLED Controls' },
  },
  {
    path: 'dmxmap',
    component: DmxMapComponent,
    data: { title: 'DMX Map' },
  },
  {
    path: 'edit',
    component: EditComponent,
    data: { title: 'Edit' },
  },
  {
    path: 'live',
    // TODO combine LiveViewComponent & LiveViewWsComponent
    component: LiveViewComponent,
    data: { title: 'Live View' },
  },
  // TODO how to use the MessageComponent?
  // { path: 'n/a', component: MessageComponent },
  {
    path: 'quick-stats',
    component: QuickStatsComponent,
    data: { title: 'Quick Stats' },
  },
  {
    path: 'reset', // TODO change to reboot? maybe use both interchangeably? but prefer reboot?
    component: ResetComponent,
    data: { title: 'Reboot' },
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
  },
  {
    path: 'teapot', // TODO remove?
    component: TeapotComponent,
    data: { title: '418 Teapot' },
  },
  {
    path: 'update',
    component: UpdateComponent,
    data: { title: 'Update Firmware' },
  },
  {
    path: 'u',
    component: UserModPageComponent,
    data: { title: 'Usermod' },
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    data: { title: 'Welcome' },
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: { title: '404 Not Found' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
