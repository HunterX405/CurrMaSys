import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

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

  isTableVisible: boolean = true;
  isAddFormVisible: boolean = false;

  onAdd() {
    this.isAddFormVisible = !this.isAddFormVisible;
    this.isTableVisible = !this.isTableVisible;
  }

  registerForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    userType: ["", [Validators.required]],
  })

  constructor(private fb: FormBuilder,
    private apiService: ApiService,private httpClient: HttpClient,private router: Router,) { }

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
          this.successMessage = "Registration Successful\n" + "Email: " + data?.email + "\nPassword: " + data?.password;
          alert("Registration Successful\n" + "Email: " + data?.email + "\nPassword: " + data?.password);
          console.log("Registration Successful", data);
          const emailData = {
            "sender": {"name": "CurrMaSys", "email": "currmasys@gmail.com"},
            "to": [{"email": data?.email}],
            "htmlContent": "Hello " + data?.name + ",<br><br>Your password is "+data?.password+"<br><br>Best regards,<br>CurrMaSys",
            "subject": "Registration Successful"
          };
          const headers = {"Content-Type": "application/json", "api-key": "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"};
          this.httpClient.post("https://api.sendinblue.com/v3/smtp/email", emailData, {headers}).subscribe(
            response => location.reload(),
            error => console.log("Failed to send email", error)
            );
        
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
