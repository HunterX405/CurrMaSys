import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  userName: string = '';
  userType: string = '';

  user = this.apiService.getUserDetails().subscribe(response => {
    console.log(response);
    this.userName = response.name;
    this.userType = response.userType;
  });

  constructor(private apiService: ApiService) { }

}
