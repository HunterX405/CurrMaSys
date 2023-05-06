import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { SubjectComponent } from './subject/subject.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { EditSubjectComponent } from './edit-subject/edit-subject.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisableUserComponent } from './disable-user/disable-user.component';
import { EnableUserComponent } from './enable-user/enable-user.component';
import { ElectiveSubjComponent } from './elective-subj/elective-subj.component';
import { EditElectiveComponent } from './edit-elective/edit-elective.component';
import { VoteComponent } from './vote/vote.component';
import { SubmitFeedbackComponent } from './submit-feedback/submit-feedback.component';
import { CurrFeedbackComponent } from './curr-feedback/curr-feedback.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { CurriculumViewComponent } from './curriculum-view/curriculum-view.component';
import { SettingsComponent } from './settings/settings.component';
import { ViewSubjectComponent } from './view-subject/view-subject.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AccountComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    SubjectComponent,
    SidenavComponent,
    EditSubjectComponent,
    DisableUserComponent,
    EnableUserComponent,
    EditSubjectComponent,
    ElectiveSubjComponent,
    EditElectiveComponent,
    VoteComponent,
    SubmitFeedbackComponent,
    CurrFeedbackComponent,
    CurriculumComponent,
    UnauthorizedComponent,
    CurriculumViewComponent,
    SettingsComponent,
    ViewSubjectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
