import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Observable, first } from 'rxjs';
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

  isFormSubmitted: boolean = false;
  isLoginFailed: boolean = false;

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router) { }

  // From the Login Project on PHP
  // Current Issues: Copied, Deprecated Code 
  // Still does not understand the purpose of all contents in this function
  // 1st Param - to access the keys or values of form
  userLogin(loginForm: FormGroup) {
    // Accessing the inputted value on the loginForm
    const { email, password } = loginForm.value;
    this.apiService.userLogin(email, password).subscribe({
      next: (data) => {
        // User represent an object that contains all data from the DB.
        // User is an array so accessing the 1st element is used then accessing the other properties in the array.
        const redirect = this.apiService.redirectUrl ?? '/dashboard';
        this.router.navigate([redirect]);
        console.log('Login Successful');
      },
      error: (err) => {
        this.isLoginFailed = true;
        console.log('Login Failed. Incorrect email or password');
      },
    });
    this.isFormSubmitted = true;
  }

  // To get the value of each key in the loginForm
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  // Unused function because it has deprecated code
  // From the Login Project on PHP
  // loginUserV2(loginForm: FormGroup) {
  //   this.apiService.loginUser(loginForm.value.email, loginForm.value.password).pipe(first()).subscribe(
  //     user => {
  //       const redirect = this.apiService.redirectUrl ? this.apiService.redirectUrl : '/dashboard';
  //       this.router.navigate([redirect]);
  //       console.log("Login Successful")
  //     },
  //     error => {
  //       console.log("Login Failed. Incorrect email or password");
  //     }
  //   )
  // }
}
