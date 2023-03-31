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

  registerForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
    userType: ["", [Validators.required]]
  })

  constructor(private fb: FormBuilder,
    private apiService: ApiService) { }

  ngOnInit(): void {
    // When the component is loaded, the users (variable) will have its value.
    this.displayUsers();
  }

  // Registering the user
  registerUser(registerForm: FormGroup) {
    const { name, email, password, userType } = registerForm.value;
    this.apiService.registerUser(name, email, password, userType).subscribe({
      next: (data) => {
        console.log("Registration Successful");
      },
      error: (err) => {
        console.log("Registration Failed");
      }
    })
  }

  // Getting the list of users
  displayUsers() {
    this.apiService.displayUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(typeof data)
        console.log("Display Successful");
      },
      error: (err) => {
        console.log("Display Failed");
      }
    })
  }

  get name() { return this.registerForm.value.name };
  get email() { return this.registerForm.value.email };
  get password() { return this.registerForm.value.password };
  get userType() { return this.registerForm.value.userType };
}
