import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LiveViewRoutingModule } from './live-view-routing.module';
import { LiveViewComponent } from './live-view.component';

// TODO why is this its own module? can it be added directly to app module?
@NgModule({
  declarations: [LiveViewComponent],
  exports: [LiveViewComponent],
  imports: [
    CommonModule,
    LiveViewRoutingModule,
  ],
})
export class LiveViewModule { }
