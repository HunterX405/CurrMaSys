import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import Chart from 'chart.js/auto';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userName: string = '';
  userType: string = '';
  count: any = {};
  countuser: any = {};
  countcurrstat: any = {};
  noFileUploaded: any = "";
  allsubjectTotal: any;
  subjectTotal: any;
  electiveTotal: any;
  chartOptions:any;
  chart: any;
  adminCount:any;
  chairCount:any;
  stakeCount:any;
  memberCount:any;
  approvedCount:any;
  pendingCount:any;
  returnedCount:any;

  user = this.apiService.getUserDetails().subscribe(response => {
    console.log(response);
    this.userName = response.name;
    this.userType = response.userType;
  });

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.countFunc();
    this.countUser();
    this.countCurrStat();

  }

 
  countFunc() {
    this.apiService.count().subscribe((data) => {
      this.count = data;
      this.noFileUploaded = Number(this.count.subject) + Number(this.count.elective);
      this.allsubjectTotal = parseInt(this.count.subject, 10) + parseInt(this.count.elective, 10);
      this.electiveTotal = parseInt(this.count.elective, 10);
      this.subjectTotal = parseInt(this.count.subject, 10);
      this.chart = new Chart("subjectChart", {
        type: 'pie', //this denotes tha type of chart
  
        data: {// values on X-Axis
          labels: ['Base Subject', 'Elective' ],
           datasets: [{
      label: 'Subject',
      data: [ this.subjectTotal,  this.electiveTotal],
      backgroundColor: [
        'RoyalBlue ',
        'LightSteelBlue ',	
      ],
      hoverOffset: 4
    }],
        },
        options: {
          aspectRatio:2.5
        }
  
      });
    });
  }

  countCurrStat(){
    this.apiService.countCurrStatus().subscribe((data) => {
      this.countcurrstat = data;
    });
  }

  countUser() {
    this.apiService.countUser().subscribe((data) => {
      this.countuser = data;
      this.memberCount = parseInt(this.countuser.member, 10);
      this.adminCount = parseInt(this.countuser.admin, 10);
      this.chairCount = parseInt(this.countuser.chair, 10);
      this.stakeCount = parseInt(this.countuser.stakeholder, 10);
 
      this.chart = new Chart("userChart", {
        type: 'bar', //this denotes tha type of chart
  
        data: {// values on X-Axis
          labels: ['Admin', 'Chairman','Member','StakeHolder'],
           datasets: [{
      label: 'Users',
      data: [ this.adminCount,  this.chairCount, this.memberCount,this.stakeCount],
      backgroundColor: [
        'RoyalBlue ',
        'LightSteelBlue ',
        'MidnightBlue ',
        'CornflowerBlue '	
      ],
    }],
        },
        options: {
          aspectRatio:2.5
        }
  
      });
    });
  }
}

