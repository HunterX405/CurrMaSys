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

const routes: Routes = [
   { path: "login", component: LoginComponent, title: "Login" },
   { path: "unauthorized", component: UnauthorizedComponent, title: "Unauthorized" },
   { path: "forgot-password", component: ForgotPasswordComponent, title: "Forgot Password" },
   { path: "dashboard", component: DashboardComponent, title: "Dashboard" },
   { path: "subject", component: SubjectComponent, title: "Subjects" },
   { path: "subject-edit/:id", component: EditSubjectComponent, title: "Edit Subject" },
   { path: "elective", component: ElectiveSubjComponent, title: "Elective" },
   { path: "elective-edit/:id", component: EditElectiveComponent, title: "Edit Elective" },
   { path: "account", component: AccountComponent, title: "Accounts", canActivate: [authGuard], data: { userType: 'admin' } },
   { path: "profile", component: ProfileComponent, title: "Profile" },
   { path: "deactivate/:id", component: DisableUserComponent, title: "Disable User" },
   { path: "activate/:id", component: EnableUserComponent, title: "Enable User" },
   { path: "vote", component: VoteComponent, title: "Curriculum Feedback" },
   { path: "feedback/:id", component: SubmitFeedbackComponent, title: "Feedback" },
   { path: "status/:id", component: CurrFeedbackComponent, title: "Curriculum Status" },
   { path: "curriculum", component: CurriculumComponent, title: "Curriculums" },
   { path: "curriculum/:id", component: CurriculumViewComponent, title: "View Curriculum" },
   { path: "", redirectTo: "login", pathMatch: 'full' },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }