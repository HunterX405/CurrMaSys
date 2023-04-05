import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute,Router  } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-disable-user',
  templateUrl: './disable-user.component.html',
  styleUrls: ['./disable-user.component.css']
})
export class DisableUserComponent implements OnInit {

  userEmail: string = '';
  id: any;
  user: any;
  deactivateUserForm = this.fb.group({
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
        this.deactivateUserForm.setValue({
          userid: this.user.userid = this.id,
          isActive: this.user.isActive = '0',
        });
      });
    });
  }

  deactivateUser(): void {
    this.apiService.activationUser(this.id,this.deactivateUserForm.value).subscribe(res => {
      console.log(res);
      alert(this.user.name +' successfully deactivated');
      this.router.navigate(['/account']);
    });
  }


  
  // deactivateUser(): void {
  //   this.httpclient.post('http://localhost/CurrMaSys/php/disableUser.php?id=' + this.id, this.deactivateUserForm.value).subscribe(res => {
  //     console.log(res);
  //     alert(this.user.name +' successfully deactivated');
  //     this.router.navigate(['/account']);
  //   });
  // }



  // deactivateUser(deactivateUserForm: FormGroup) {
  //   let {userid, isActive, email} = deactivateUserForm.value;
  //       this.apiService.deactivateUser(userid, isActive, email).subscribe({
  //         next: (data) => {
  //           console.log("Deactivate User Successful")
  //           console.log("@Next Component")
  //           console.log(data);
  //         },
  //         error: (err) => {
  //           console.log("Deactivate Users Failed")
  //           console.log("@Error Component")
  //           console.log(err);
  //         }
  //       });     
  // }

}




