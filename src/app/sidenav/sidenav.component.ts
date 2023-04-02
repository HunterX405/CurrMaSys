import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
    // Testing to hold the data of the logged in user
    userData: any = this.apiService.tempUser;
    constructor(private apiService: ApiService) { }
}
