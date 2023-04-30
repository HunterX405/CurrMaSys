import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { SubjectComponent } from './subject/subject.component';
import { DisableUserComponent } from './disable-user/disable-user.component';
import { EnableUserComponent } from './enable-user/enable-user.component';
import { authGuard } from './auth-guard';
import { EditSubjectComponent } from './edit-subject/edit-subject.component';
import { ElectiveSubjComponent } from './elective-subj/elective-subj.component';
import { EditElectiveComponent } from './edit-elective/edit-elective.component';
import { VoteComponent } from './vote/vote.component';
import { SubmitFeedbackComponent } from './submit-feedback/submit-feedback.component';
import { CurrFeedbackComponent } from './curr-feedback/curr-feedback.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { CurriculumViewComponent } from './curriculum-view/curriculum-view.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { FeedbackPrintComponent } from './feedback-print/feedback-print.component';
import { CurriculumPrintComponent } from './curriculum-print/curriculum-print.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
   { path: "login", component: LoginComponent, title: "Login" },
   { path: "unauthorized", component: UnauthorizedComponent, title: "Unauthorized" },
   { path: "forgot-password", component: ForgotPasswordComponent, title: "Forgot Password" },
   { path: "dashboard", component: DashboardComponent, title: "Dashboard", canActivate: [authGuard], data: { userType: ['admin','chair','member','stakeholder'] }},
   { path: "subject", component: SubjectComponent, title: "Subjects", canActivate: [authGuard],data: { userType: ['admin','chair','member'] }},
   { path: "subject-edit/:id", component: EditSubjectComponent, title: "Edit Subject", canActivate: [authGuard], data: { userType: ['admin','chair','member'] }},
   { path: "elective", component: ElectiveSubjComponent, title: "Elective", canActivate: [authGuard], data: { userType: ['admin','chair','member'] }},
   { path: "elective-edit/:id", component: EditElectiveComponent, title: "Edit Elective", canActivate: [authGuard], data: { userType: ['admin','chair','member'] }},
   { path: "account", component: AccountComponent, title: "Accounts", canActivate: [authGuard], data: { userType: ['admin']}},
   { path: "profile", component: ProfileComponent, title: "Profile", canActivate: [authGuard], data: { userType: ['admin','chair','member','stakeholder'] }},
   { path: "deactivate/:id", component: DisableUserComponent, title: "Disable User", canActivate: [authGuard], data: { userType: ['admin'] }},
   { path: "activate/:id", component: EnableUserComponent, title: "Enable User", canActivate: [authGuard], data: { userType: ['admin'] }},
   { path: "vote", component: VoteComponent, title: "Curriculum Feedback", canActivate: [authGuard], data: { userType: ['admin','chair','member','stakeholder'] }},
   { path: "feedback/:id/:ver", component: SubmitFeedbackComponent, title: "Feedback", canActivate: [authGuard], data: { userType: ['stakeholder'] }},
   { path: "status/:id/:ver", component: CurrFeedbackComponent, title: "Curriculum Status", canActivate: [authGuard], data: { userType: ['admin','chair','member'] }},
   { path: "curriculum", component: CurriculumComponent, title: "Curriculums", canActivate: [authGuard], data: { userType: ['admin','chair','member','stakeholder'] }},
   { path: "curriculum/:id/:ver", component: CurriculumViewComponent, title: "View Curriculum", canActivate: [authGuard], data: { userType: ['admin','chair','member','stakeholder'] } },
   { path: "curriculum/print/:id/:ver/:year/:semester", component: CurriculumPrintComponent, title: "Print Curriculum", canActivate: [authGuard], data: { userType: ['admin','chair'] }},
   { path: "feedback/print/:id/:ver", component: FeedbackPrintComponent, title: "Print Feedback", canActivate: [authGuard], data: { userType: ['admin','chair','member'] }},
   { path: "settings", component: SettingsComponent, title: "Settings"},
   { path: "", redirectTo: "login", pathMatch: 'full' },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }