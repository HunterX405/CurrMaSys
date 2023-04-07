import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent {
  isMatching: boolean = true;
  isSubmitted: boolean = false;
  isSuccess: boolean = false;

  forgotForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    newPassword: ["", [Validators.required]],
    conPassword: ["", [Validators.required]]
  })

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) { }

  resetPassword(forgotForm: FormGroup) {
    const { email, newPassword, conPassword } = forgotForm.value;
    if (newPassword === conPassword) {
      this.isMatching = true;
      this.isSuccess = true;

      this.apiService.resetPassword(email, newPassword).subscribe({
        next: (data) => {
          console.log(data);
          alert(data.message);
          if (data.success) {
            this.router.navigate(['/login']);
          } else {
            location.reload();
          }
        },
        error: (err) => {
          console.log("Reset Password Failed", err);
        }
      });
    } else {
      this.isMatching = false;
      this.isSubmitted = true;
    }
  }
  get email() { return this.forgotForm.get('email'); }
  get newPassword() { return this.forgotForm.get('newPassword'); }
  get conPassword() { return this.forgotForm.get('conPassword'); }
}
