import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-enable-user',
  templateUrl: './enable-user.component.html',
  styleUrls: ['./enable-user.component.css']
})

export class EnableUserComponent implements OnInit {
  id: any;
  activateUserForm = this.fb.group({
    userid: [''],
    isActive: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.activateUserForm.setValue({
        userid: this.id,
        isActive: '1',
      });
    });
  }

  activateUser(): void {
    this.apiService.activationUser(this.id, this.activateUserForm.value).subscribe(res => {
      console.log(res);
      alert("Account ID:" + this.id + ' was successfully activated');
      this.router.navigate(['/account']);
    });
  }


}
