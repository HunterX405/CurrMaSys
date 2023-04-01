import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: "login", component: LoginComponent, title: "Login"},
  {path: "forgot-password", component: ForgotPasswordComponent, title: "Forgot Password"},
  {path: "dashboard", component: DashboardComponent, title: "Dashboard"},
  {path: "account", component: AccountComponent, title: "Accounts"},
  {path: "profile", component: ProfileComponent, title: "Profile"},
  {path: "", redirectTo: "login", pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
