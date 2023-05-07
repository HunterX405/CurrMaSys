import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import * as $ from 'jquery';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import { HttpClient } from '@angular/common/http';


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
    activeSubcategory = 'All';

    constructor(private fb: FormBuilder,
        private apiService: ApiService,
        private httpClient: HttpClient

    ) { }

    ngOnInit(): void {
        // When the component is loaded, the users (variable) will have its value.
        this.displayUsers();
    }

    onAdd() {
        this.isAddFormVisible = !this.isAddFormVisible;
        this.isTableVisible = !this.isTableVisible;
    }

    onGoBack() {
        this.isAddFormVisible = !this.isAddFormVisible;
        this.isTableVisible = !this.isTableVisible;
        this.displayUsers();
    }

    registerForm = this.fb.group({
        name: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        userType: ["", [Validators.required]],
    })

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
                        "sender": { "name": "CurrMaSys", "email": "currmasys@gmail.com" },
                        "to": [{ "email": data?.email }],
                        "htmlContent": "Hello " + data?.name + ",<br><br>Your password is " + data?.password + "<br><br>Best regards,<br>CurrMaSys",
                        "subject": "Registration Successful"
                    };
                    const headers = { "Content-Type": "application/json", "api-key": "nadedetect ng sendinblue yung api kaya wala muna" };
                    this.httpClient.post("https://api.sendinblue.com/v3/smtp/email", emailData, { headers }).subscribe(
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

                this.setDataTable();
            },
            error: (err) => {
                console.log("Get Users Failed", err);
            }
        });
    }

    setDataTable() {
        let users = this.users;
        // jQuery $(document).ready(function({})) is deprecated, Use $(function() {} instead.
        $(function () {
            $('#accountsTable').DataTable({
                data: users,
                dom: '<"row"<"top-left col-sm-6" f><"top-right d-flex justify-content-end col-sm-6"B>rt<"bottom"ip><"clear">',
                buttons: [
                    {
                        extend: 'csv',
                        text: 'CSV',
                        className: 'btn btn-primary',
                        exportOptions: {
                            columns: ':visible:not(:nth-child(6))'
                        }
                    },
                    {
                        extend: 'print',
                        text: 'PDF',
                        className: 'btn btn-primary',
                        exportOptions: {
                            columns: ':visible:not(:nth-child(6))'
                        }
                    },
                ],
                "ordering": false,
                language: {
                    searchPlaceholder: "Find records..."
                },
                "pageLength": 10,
                columns: [
                    { data: 'id', title: 'ID' },
                    { data: 'name', title: 'Name' },
                    { data: 'email', title: 'Email' },
                    { data: 'userType', title: 'User Type' },
                    {
                        data: 'isActive', title: 'Status', render: (data, type, row) => {
                            if (row.isActive) {
                                return '<strong style="color: #31a24c;"> Active </strong>';
                            }
                            return '<span class="text-muted"> <strong style="color: #686868;"> Inactive </strong></span>';
                        }
                    },
                    {
                        data: null, title: 'Actions', render: (data, type, row) => {
                            if (row.isActive) {
                                return `<a href="deactivate/${row.id}" class="btn btn-danger btn-sm text-white">Deactivate</a>`;
                            }
                            return `<a href="activate/${row.id}" class="btn btn-primary btn-sm px-3">Activate</a>`;
                        }
                    }
                ]
            });
        });
    }

    setSubCategory(subcategory: string) {
        this.activeSubcategory = subcategory;
        this.refreshTable();
    }

    refreshTable() {
        let users = this.users;
        if (this.activeSubcategory !== 'All') {
            if (this.activeSubcategory === 'Active') {
                users = this.users.filter(user =>
                    user.isActive == 1
                );
            } else {
                users = this.users.filter(user =>
                    user.isActive == 0
                );
            }
        }
        $('#accountsTable').DataTable().clear().rows.add(users).draw();
    }
}
