import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DmxMapComponent } from './dmx-map/dmx-map.component';
import { EditComponent } from './edit/edit.component';
import { MessageComponent } from './shared/message/message.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QuickStatsComponent } from './quick-stats/quick-stats.component';
import { RestartComponent } from './restart/restart.component';
import { TeapotComponent } from './teapot/teapot.component';
import { ToastComponent } from './shared/toast/toast.component';
import { UpdateComponent } from './update/update.component';
import { UserModPageComponent } from './user-mod-page/user-mod-page.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    DmxMapComponent,
    EditComponent,
    MessageComponent,
    NotFoundComponent,
    QuickStatsComponent,
    RestartComponent,
    TeapotComponent,
    ToastComponent,
    UpdateComponent,
    UserModPageComponent,
    WelcomeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
