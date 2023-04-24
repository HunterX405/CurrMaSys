import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  userName: string = '';
  userType: string = '';

  user = this.apiService.getUserDetails().subscribe(response => {
    this.userName = response.name;
    this.userType = response.userType;
  });

  constructor(private apiService: ApiService,
    private router:Router) { }

  logout(){
    console.log("logged out and session expired")
    this.apiService.deleteCookie("jwt_token")
    this.router.navigate(['/login']);
  }
}
