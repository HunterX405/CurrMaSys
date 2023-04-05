import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { SubjectComponent } from './subject/subject.component';
//import { SidenavComponent } from './sidenav/sidenav.component';
import { authGuard } from './auth-guard';
import { EditSubjectComponent } from './edit-subject/edit-subject.component';

const routes: Routes = [
  {path: "login", component: LoginComponent, title: "Login"},
  {path: "forgot-password", component: ForgotPasswordComponent, title: "Forgot Password"},
  {path: "dashboard", component: DashboardComponent, title: "Dashboard", canActivate: [authGuard]},
  {path: "subject-edit/:id", component: EditSubjectComponent, title: "Edit Subject"},
  {path: "subject", component: SubjectComponent, title: "Subjects"},
  
  {path: "account", component: AccountComponent, title: "Accounts"},
  {path: "profile", component: ProfileComponent, title: "Profile"},
  {path: "", redirectTo: "login", pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
