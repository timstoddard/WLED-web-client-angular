import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ControlsComponent } from './controls.component';
import { RouteWithPageTitle } from '../shared/page-title.service';

// TODO page titles should match existing web app (?)
const routes: RouteWithPageTitle[] = [
  {
    path: '',
    component: ControlsComponent,
    data: { title: 'WLED Controls' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlsRoutingModule { }
