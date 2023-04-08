import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {

  userName!: string;
  email!: string;
  user!: any;

  editProfileForm = this.fb.group({
    id: [""],
    name: ["", [Validators.required]],
    email: ["", [Validators.required]],
    newPassword: [""],
    conPassword: [""],
  });

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.apiService.getUserDetails().subscribe(response => {
      this.userName = response.name;
      this.email = response.email;

      this.editProfileForm.get("id")?.setValue(response.id);
      this.editProfileForm.get("name")?.setValue(response.name);
      this.editProfileForm.get("email")?.setValue(response.email);
    });
  }

  isFormSubmitted: boolean = false;
  isMatching: boolean = true;
  isSuccess: boolean = false;

  editProfile(editProfileForm: FormGroup) {
    let { id, name, email, newPassword, conPassword } = editProfileForm.value;
    if (editProfileForm.valid) {
      if (newPassword === conPassword) {
        if (name !== this.userName || email !== this.email || conPassword !== "") {
          this.apiService.editProfile(id, name, email, newPassword).subscribe({
            next: (data) => {
              console.log("Update Profile Successful", data);
              this.userName = data.user.name;
              this.email = data.user.email;
              this.editProfileForm.get("newPassword")?.setValue("");
              this.editProfileForm.get("conPassword")?.setValue("");
              alert("Profile Updated Successfully.");
            },
            error: (err) => {
              console.log("Update Profile Failed", err);
            }
          });
        }
        else {
          console.log("No data updated.");
        }
      }
      else {
        console.log("Passwords doesn't match.");
        alert("Passwords doesn't match.");
      }
    }
    else {
        this.isMatching = false;
    }
    this.isFormSubmitted = true;
  }
}
