import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent {
   // Creating the Login form with its default value and validators
   loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
   })

   // For error messages
   isFormSubmitted: boolean = false;
   isLoginFailed: boolean = false;
   message: string = '';
   assetsUrl: string = environment.assetsUrl;

   constructor(private fb: FormBuilder,
      private apiService: ApiService,
      private router: Router,
   ) { }

   loginUser(loginForm: FormGroup) {
      // Accessing the inputted value on the loginForm
      const { email, password } = loginForm.value;

      if (loginForm.valid) {
         this.apiService.loginUser(email, password).subscribe(response => {
            // Check if the login was successful
            if (response.success) {

                this.apiService.setCookie('email', response.user.email);
                this.apiService.setCookie('name', response.user.name);
                this.apiService.setCookie('id', response.user.id);
                this.apiService.setCookie('userType', response.user.userType);
               // Redirect to dashboard upon successful login.
               const redirect = this.apiService.redirectUrl ?? '/dashboard';
               this.router.navigate([redirect]);
            } else {
               console.log(response.message); // Log the error message
               this.isLoginFailed = true;
               this.message = response.message;
            }
         });

      }
      this.isFormSubmitted = true;
   }

   // To get the value of each key in the loginForm
   get email() { return this.loginForm.get('email'); }
   get password() { return this.loginForm.get('password'); }
}
