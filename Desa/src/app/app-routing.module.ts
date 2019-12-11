import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLoginComponent } from "./page-login/page-login.component"
import { PageHomeComponent } from "./page-home/page-home.component"
import { LoginService } from './page-login/login.service';

const routes: Routes = [
  { path: '', redirectTo: "/login", pathMatch: 'full' },
  { path: 'public', redirectTo: "login", pathMatch: 'full'},
  { path: 'login', component: PageLoginComponent},
  { path: 'home', component: PageHomeComponent , canActivate: [LoginService]},
  { path: '**', redirectTo: '/login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
