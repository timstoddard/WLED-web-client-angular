import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LiveViewRoutingModule } from './live-view-routing.module';
import { LiveViewComponent } from './live-view.component';

@NgModule({
  declarations: [LiveViewComponent],
  exports: [LiveViewComponent],
  imports: [
    CommonModule,
    LiveViewRoutingModule,
  ],
})
export class LiveViewModule { }
