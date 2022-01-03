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

const routes: Routes = [
  {
    path: 'controls', // also keep /sliders?
    component: ControlsComponent,
  },
  {
    path: 'dmxmap',
    component: DmxMapComponent,
  },
  {
    path: 'edit',
    component: EditComponent,
  },
  {
    path: 'live',
    // TODO combine LiveViewComponent & LiveViewWsComponent
    component: LiveViewComponent,
  },
  // TODO how to use the MessageComponent?
  // { path: 'n/a', component: MessageComponent },
  {
    path: 'quick-stats',
    component: QuickStatsComponent,
  },
  {
    path: 'reset',
    component: ResetComponent,
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
  },
  {
    path: 'teapot', // remove?
    component: TeapotComponent,
  },
  {
    path: 'update',
    component: UpdateComponent,
  },
  {
    path: 'u',
    component: UserModPageComponent,
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
