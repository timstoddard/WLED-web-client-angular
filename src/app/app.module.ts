import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DmxMapComponent } from './dmx-map/dmx-map.component';
import { EditComponent } from './edit/edit.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { LiveViewWsComponent } from './live-view-ws/live-view-ws.component';
import { MessageComponent } from './message/message.component';
import { ResetComponent } from './reset/reset.component';
import { SettingsComponent } from './settings/settings.component';
import { TeapotComponent } from './teapot/teapot.component';
import { UpdateComponent } from './update/update.component';
import { UserModPageComponent } from './user-mod-page/user-mod-page.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { QuickStatsComponent } from './quick-stats/quick-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    DmxMapComponent,
    EditComponent,
    LiveViewComponent,
    LiveViewWsComponent,
    MessageComponent,
    ResetComponent,
    SettingsComponent,
    TeapotComponent,
    UpdateComponent,
    UserModPageComponent,
    WelcomeComponent,
    QuickStatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
