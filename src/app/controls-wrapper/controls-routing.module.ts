import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ControlsWrapperComponent } from './controls-wrapper.component';
import { ApiDataResolver } from './api-data.resolver';
import { RouteWithPageTitle } from '../shared/page-title.service';
import { SegmentsComponent } from './segments/segments.component';
import { PresetsComponent } from './presets/presets.component';
import { ControlsComponent } from './controls/controls.component';
import { InfoComponent } from './info/info.component';
import { PresetsResolver } from './presets/presets.resolver';
import { CustomEffectsComponent } from './custom-effects/custom-effects.component';
import { PCModeRedirectGuard } from './route-guards/pc-mode-redirect.guard';

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
    canActivate: [PCModeRedirectGuard],
  },
  {
    path: 'presets',
    component: PresetsComponent,
    data: { title: 'Presets' },
    canActivate: [PCModeRedirectGuard],
  },
  {
    path: 'info',
    component: InfoComponent,
    data: { title: 'Info' },
    canActivate: [PCModeRedirectGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule),
  },
  {
    // TODO for now only include path in dev builds, not prod
    path: 'custom-effects',
    component: CustomEffectsComponent,
    data: { title: 'Custom Effects' },
    canActivate: [PCModeRedirectGuard],
  },
];

// TODO should page titles match existing web app? (lean no)
const routes: RouteWithPageTitle[] = [
  {
    path: '',
    component: ControlsWrapperComponent,
    data: { title: 'WLED Controls' },
    resolve: {
      data: ApiDataResolver,
      presets: PresetsResolver,
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
