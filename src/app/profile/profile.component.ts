import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  userName: string = '';
  userEmail: string = '';
  editProfileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.apiService.getUserDetails().subscribe(response => {
      this.userName = response.name;
      this.userEmail = response.email;
      this.editProfileForm = this.fb.group({
        name: [this.userName || '', [Validators.required]],
        email: [this.userEmail || '', [Validators.required, Validators.email]],
        newPassword: ["", [Validators.required]],
        conPassword: ["", [Validators.required]]
      });
    });
  }

  isFormSubmitted: boolean = false;
  isMatching: boolean = true;
  isSuccess: boolean = false;

  editProfile(editProfileForm: FormGroup) {
    let { name, email, newPassword, conPassword } = editProfileForm.value;

    if (editProfileForm.valid) {
    if (newPassword === conPassword || (newPassword === "" && conPassword === "")) {
      if ((newPassword !== "" && conPassword !== "")) {
        
        this.apiService.editProfile(name, email, newPassword).subscribe({
          next: (data) => {
            this.isSuccess = true;
            console.log("Update Profile Successful")
            console.log("@Next Component")
            console.log(data);
          },
          error: (err) => {
            console.log("Update Profile Failed")
            console.log("@Error Component")
            console.log(err);
          }
        });
      }
    }
    else {
      this.isMatching = false;
    }
  }
  this.isFormSubmitted = true;
}
  get name() { return this.editProfileForm.value.name }
  get email() { return this.editProfileForm.value.email }
  get newPassword() { return this.editProfileForm.value.newPassword }
  get conPassword() { return this.editProfileForm.value.conPassword }
}
