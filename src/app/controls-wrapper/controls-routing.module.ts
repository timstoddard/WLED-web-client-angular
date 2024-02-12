import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ControlsWrapperComponent } from './controls-wrapper.component';
import { ApiDataResolver } from './api-data.resolver';
import { RouteWithPageTitle } from '../shared/page-title.service';
import { SegmentsComponent } from './segments/segments.component';
import { PresetsComponent } from './presets/presets.component';
import { ControlsComponent } from './controls/controls.component';
import { InfoComponent } from './info/info.component';

const childRoutes = [
  {
    path: '',
    component: ControlsComponent,
    data: { title: 'WLED Controls' },
  },
  {
    path: 'segments',
    component: SegmentsComponent,
    data: { title: 'Segments' },
  },
  {
    path: 'presets',
    component: PresetsComponent,
    data: { title: 'Presets' },
  },
  {
    path: 'info',
    component: InfoComponent,
    data: { title: 'Info' },
  },
  {
    path: 'settings',
    loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule),
  },
];

// TODO page titles should match existing web app (?)
const routes: RouteWithPageTitle[] = [
  {
    path: '',
    component: ControlsWrapperComponent,
    data: { title: 'WLED Controls' },
    resolve: {
      data: ApiDataResolver,
    },
    children: childRoutes,
    runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlsRoutingModule { }
