import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
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

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) { }

  loginUser(loginForm: FormGroup) {
    // Accessing the inputted value on the loginForm
    const { email, password } = loginForm.value;
    this.apiService.loginUser(email, password).subscribe(response => {
      // Check if the login was successful
      if (response.success) {
        // Storing user details in the api service.
        // const user = response.user;
        // Redirect to dashboard upon successful login.
        this.apiService.deleteCookie('jwt_token');
        this.apiService.setCookie('jwt_token', response.jwt);
        const redirect = this.apiService.redirectUrl ?? '/dashboard';
        this.router.navigate([redirect]);
      } else {
        console.log(response.message); // Log the error message
        this.isLoginFailed = true;
        this.message = response.message;
      }
    });
    this.isFormSubmitted = true;
  }

  // To get the value of each key in the loginForm
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
