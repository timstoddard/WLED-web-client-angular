import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DmxMapComponent } from './dmx-map/dmx-map.component';
import { EditComponent } from './edit/edit.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QuickStatsComponent } from './quick-stats/quick-stats.component';
import { RestartComponent } from './restart/restart.component';
import { RouteWithPageTitle } from './shared/page-title.service';
import { TeapotComponent } from './teapot/teapot.component';
import { UpdateComponent } from './update/update.component';
import { UserModPageComponent } from './user-mod-page/user-mod-page.component';
import { WelcomeComponent } from './welcome/welcome.component';

// TODO use built-in router title property
// https://angular.io/guide/router#setting-the-page-title

// TODO page titles should match existing web app (?)
const routes: RouteWithPageTitle[] = [
  // auto-redirect to controls page
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'controls',
    data: { title: 'WLED' },
  },

  // lazy loaded feature modules
  {
    path: 'controls', // TODO also keep /sliders? (thinking not)
    loadChildren: () => import('./controls-wrapper/controls.module').then(m => m.ControlsModule),
  },  

  // direct routes
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
    loadChildren: () => import('./shared/live-view/live-view.module').then(m => m.LiveViewModule),
  },
  {
    path: 'quick-stats',
    component: QuickStatsComponent,
    data: { title: 'Quick Stats' },
  },
  {
    path: 'restart', // used to be `reset`
    component: RestartComponent,
    data: { title: 'Restart' },
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

  // handle unknown routes (404 page)
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
