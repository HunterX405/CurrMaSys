import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  tempUser = this.apiService.tempUser;
  editProfileForm = this.fb.group({
    name: [this.apiService.tempUser.name, [Validators.required]],
    email: [this.apiService.tempUser.email, [Validators.required]],
    newPassword: [""],
    conPassword: [""]
  });

  constructor(private fb: FormBuilder,
    private apiService: ApiService) { }

  editProfile(editProfileForm: FormGroup) {
    let { name, email, newPassword, conPassword } = editProfileForm.value;

    if (newPassword === conPassword || (newPassword === "" && conPassword === "")) {
      if ((newPassword === "" && conPassword === "")) { 
        newPassword = this.apiService.tempUser.password
      }
      this.apiService.editProfile(name, email, newPassword).subscribe({
        next: (data) => {
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

  get name() { return this.editProfileForm.value.name }
  get email() { return this.editProfileForm.value.email }
  get newPassword() { return this.editProfileForm.value.newPassword }
  get conPassword() { return this.editProfileForm.value.conPassword }
}
