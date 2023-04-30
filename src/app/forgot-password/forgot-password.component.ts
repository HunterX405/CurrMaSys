import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-forgot-password',
   templateUrl: './forgot-password.component.html',
   styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent {
   successMessage: string = "";
   isMatching: boolean = true;
   isSubmitted: boolean = false;
   isSuccess: boolean = false;
   assetsUrl: string = environment.assetsUrl;

   forgotForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      newPassword: ["", [Validators.required]],
      conPassword: ["", [Validators.required]]
   })

   constructor(
      private fb: FormBuilder,
      private apiService: ApiService,
      private router: Router,
      private httpClient: HttpClient,
   ) { }

   resetPassword(forgotForm: FormGroup) {
      const { email, } = forgotForm.value;
      this.apiService.resetPassword(email).subscribe({
         next: (data) => {
            console.log(data);
            alert("Reset Password Successful\n" + "Email: " + data?.email + "\nPassword: " + data?.newPassword + "\nCheck your Email for your new password. ");
            console.log("Reset Password Successful", data);
            const emailData = {
               "sender": { "name": "CurrMaSys", "email": "currmasys@gmail.com" },
               "to": [{ "email": data?.email }],
               "htmlContent": "Hello " + data?.email + ",<br><br>Your password is " + data?.newPassword + "<br><br>Best regards,<br>CurrMaSys",
               "subject": "Reset Password Successful"
            };
            const headers = { "Content-Type": "application/json", "api-key": "nadedetect ng sendinblue yung api kaya wala muna" };
            this.httpClient.post("https://api.sendinblue.com/v3/smtp/email", emailData, { headers }).subscribe(
               response => this.router.navigate(['/login']),
               error => console.log("Failed to send email", error)
            );
         },
         error: (err) => {
            console.log("Reset Password Failed", err);
         }
      });

   }
   get email() { return this.forgotForm.get('email'); }
}

