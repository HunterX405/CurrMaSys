import { Component , OnInit} from '@angular/core';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userName: string = '';
  userType: string = '';
  count: any = {};

  user = this.apiService.getUserDetails().subscribe(response => {
    console.log(response);
    this.userName = response.name;
    this.userType = response.userType;
  });

  constructor(private apiService: ApiService) { }
  
  ngOnInit(): void {
    this.countFunc();
  }
  countFunc(){
    this.apiService.count().subscribe((data) => {
      this.count = data;
    });
  }
  }

