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

    if (registerForm.valid) {
      this.apiService.registerUser(name, email, userType).subscribe({
        next: (data) => {
          alert("Registration Successful\n" + "Email: " + data?.email + "\nPassword: " + data?.password);
          console.log("Registration Successful", data);
          // Reload the page
          location.reload();
        },
        error: (err) => {
          console.log("Registration Failed", err);
        }
      });
    }
    this.isFormSubmitted = true;
  }
  
  // Getting the list of users
  displayUsers() {
    this.apiService.displayUsers().subscribe({
      next: (data) => {
        console.log("Get Users:", data);
        this.users = data;
      },
      error: (err) => {
        console.log("Get Users Failed", err);
      }
    });
  }
}
