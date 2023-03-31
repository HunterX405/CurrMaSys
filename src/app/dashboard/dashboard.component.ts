import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Testing to hold the data of the logged in user
  userData: any = this.apiService.tempUser;
  constructor(private apiService: ApiService) { }
}
