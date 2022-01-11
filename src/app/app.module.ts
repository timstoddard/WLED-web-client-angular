import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ControlsComponent } from './controls/controls.component';
import { DmxMapComponent } from './dmx-map/dmx-map.component';
import { EditComponent } from './edit/edit.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { MessageComponent } from './shared/message/message.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QuickStatsComponent } from './quick-stats/quick-stats.component';
import { RestartComponent } from './restart/restart.component';
import { SettingsModule } from './settings/settings.module';
import { TeapotComponent } from './teapot/teapot.component';
import { UpdateComponent } from './update/update.component';
import { UserModPageComponent } from './user-mod-page/user-mod-page.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    DmxMapComponent,
    EditComponent,
    LiveViewComponent,
    MessageComponent,
    NotFoundComponent,
    QuickStatsComponent,
    RestartComponent,
    TeapotComponent,
    UpdateComponent,
    UserModPageComponent,
    WelcomeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    SettingsModule,
  ],
  providers: [
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
