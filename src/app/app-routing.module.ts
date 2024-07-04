import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { TeamEditorComponent } from './components/team-editor/team-editor.component';
import { TournamentListComponent } from './components/tournament-list/tournament-list.component';
import { TournamentEditorComponent } from './components/tournament-editor/tournament-editor.component';
import { MatchViewerComponent } from './components/match-viewer/match-viewer.component';
import { AuthGuard } from './auth.guard'; // Importar el guard que creamos

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'teams', component: TeamListComponent, canActivate: [AuthGuard] }, // Proteger con AuthGuard
  { path: 'team-editor/:id', component: TeamEditorComponent, canActivate: [AuthGuard] }, // Proteger con AuthGuard
  { path: 'tournaments', component: TournamentListComponent, canActivate: [AuthGuard] }, // Proteger con AuthGuard
  { path: 'tournament-editor', component: TournamentEditorComponent, canActivate: [AuthGuard] }, // Proteger con AuthGuard
  { path: 'match-viewer', component: MatchViewerComponent, canActivate: [AuthGuard] }, // Proteger con AuthGuard
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
