import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute,Router  } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-enable-user',
  templateUrl: './enable-user.component.html',
  styleUrls: ['./enable-user.component.css']
})
export class EnableUserComponent implements OnInit{
  userEmail: string = '';
  id: any;
  user: any;
  activateUserForm = this.fb.group({
    userid:[''],
    isActive:[''],
  });

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private httpclient: HttpClient,
    private router: Router
  ) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.apiService.getUser(this.id).subscribe(data => {
        this.user = data;
        this.activateUserForm.setValue({
          userid: this.user.userid = this.id,
          isActive: this.user.isActive = '1',
        });
      });
    });
  }

  activateUser(): void {
    this.apiService.activationUser(this.id,this.activateUserForm.value).subscribe(res => {
      console.log(res);
      alert(this.user.name +' successfully activated');
      this.router.navigate(['/account']);
    });
  }


}
