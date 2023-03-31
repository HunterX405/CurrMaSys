import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {path: "login", component: LoginComponent, title: "Login"},
  {path: "dashboard", component: DashboardComponent, title: "Dashboard"},
  {path: "account", component: AccountComponent, title: "Accounts"},
  {path: "", redirectTo: "login", pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
