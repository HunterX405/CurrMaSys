import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router  } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-disable-user',
  templateUrl: './disable-user.component.html',
  styleUrls: ['./disable-user.component.css']
})
export class DisableUserComponent implements OnInit {

  id: any;

  deactivateUserForm = this.fb.group({
    userid:[''],
    isActive:[''],
  });

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
  ) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.deactivateUserForm.setValue({
      userid: this.id,
      isActive: '0',
    });
  }

  deactivateUser(): void {
    this.apiService.activationUser(this.id,this.deactivateUserForm.value).subscribe(res => {
      console.log(res);
      alert("Account with ID:" + this.id +' was successfully deactivated');
      this.router.navigate(['/account']);
    });
  }
}




