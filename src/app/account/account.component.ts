import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';



@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit{
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
          this.successMessage = "Registration Successful\n" + "Email: " + data?.email + "\nPassword: " + data?.password;
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
        setTimeout(() => {
          $(document).ready(function() {
            $('#accountsTable').DataTable( {
              dom: '<"top"fB>rt<"bottom"ip><"clear">',//di ko maalign yung search at buttons
              buttons: [
                {
                  extend: 'csv',
                  text: 'CSV',
                  className: 'btn btn-primary',
                },
                {
                  extend: 'print',
                  text: 'Print',
                  className: 'btn btn-primary'
                },
              ],
                "ordering": false, 
                language: {
                  searchPlaceholder: "Find records..."
                },
              "pageLength": 10,
            });
          });
        }, 0);
      },
      error: (err) => {
        console.log("Get Users Failed", err);
      }
    });
  }
}
