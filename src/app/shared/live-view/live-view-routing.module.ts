import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouteWithPageTitle } from '../page-title.service';
import { LiveViewComponent } from './live-view.component';

// TODO page titles should match existing web app (?)
const routes: RouteWithPageTitle[] = [
  {
    path: '',
    component: LiveViewComponent,
    data: { title: 'Live View' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveViewRoutingModule { }
