import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ControlsComponent } from './controls.component';
import { ControlsResolver } from './controls.resolver';
import { RouteWithPageTitle } from '../shared/page-title.service';
import { PalettesResolver } from './palettes/palettes.resolver';

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
      palettesData: PalettesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlsRoutingModule { }
