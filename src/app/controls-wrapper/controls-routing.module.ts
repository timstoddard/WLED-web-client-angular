import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ControlsWrapperComponent } from './controls-wrapper.component';
import { ControlsResolver } from './controls.resolver';
import { RouteWithPageTitle } from '../shared/page-title.service';
import { PalettesDataResolver } from './palettes/palettes-data.resolver';
import { SegmentsComponent } from './segments/segments.component';
import { PresetsComponent } from './presets/presets.component';
import { ControlsComponent } from './controls/controls.component';

// TODO page titles should match existing web app (?)
const routes: RouteWithPageTitle[] = [
  {
    path: '',
    component: ControlsWrapperComponent,
    data: { title: 'WLED Controls' },
    resolve: {
      data: ControlsResolver,
      palettesData: PalettesDataResolver,
    },
    children: [
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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlsRoutingModule { }
