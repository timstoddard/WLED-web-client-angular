import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ControlsComponent } from './controls.component';
import { ControlsResolver } from './controls.resolver';
import { RouteWithPageTitle } from '../shared/page-title.service';
import { PalettesDataResolver } from './palettes/palettes-data.resolver';

// TODO page titles should match existing web app (?)
const routes: RouteWithPageTitle[] = [
  {
    path: '',
    component: ControlsComponent,
    data: {
      title: 'WLED Controls',
    },
    resolve: {
      data: ControlsResolver,
      palettesData: PalettesDataResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlsRoutingModule { }
