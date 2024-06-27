// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { TeamEditorComponent } from './components/team-editor/team-editor.component';
import { TournamentListComponent } from './components/tournament-list/tournament-list.component';
import { TournamentEditorComponent } from './components/tournament-editor/tournament-editor.component';
import { MatchViewerComponent } from './components/match-viewer/match-viewer.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TeamListComponent,
    TeamEditorComponent,
    TournamentListComponent,
    TournamentEditorComponent,
    MatchViewerComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
