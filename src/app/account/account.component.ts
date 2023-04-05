import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  // Variable that holds the list of users
  users: any;
  successMessage: string = "";
  isFormSubmitted: boolean = false;

  registerForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    userType: ["", [Validators.required]],
  })

  constructor(private fb: FormBuilder,
    private apiService: ApiService) { }

  ngOnInit(): void {
    // When the component is loaded, the users (variable) will have its value.
    this.displayUsers();
  }

  // Registering the user
  registerUser(registerForm: FormGroup) {
    const { name, email, userType } = registerForm.value;
    let generatedPassword = this.generatePassword(8);

    if (registerForm.valid) {
      this.apiService.registerUser(name, email, generatedPassword, userType).subscribe({
        next: (data) => {
          this.successMessage = "Registration Successful" + "Email: " + email + "Password: " + generatedPassword;
          console.log("Registration Successful");
          console.log(data);
        },
        error: (err) => {
          console.log("Registration Failed");
          console.log(err);
        }
      })
    }
    this.isFormSubmitted = true;
  }

  test() {
    this.isFormSubmitted = true;
    console.log(this.registerForm.valid)
  }

  generatePassword(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Getting the list of users
  displayUsers() {
    this.apiService.displayUsers().subscribe({
      next: (data) => {
        console.log("Display Successful");
        console.log(data);
        this.users = data;
      },
      error: (err) => {
        console.log("Display Failed");
        console.log(err);
      }
    })
  }
  get name() { return this.registerForm.value.name };
  get email() { return this.registerForm.value.email };
  get userType() { return this.registerForm.value.userType };
}
