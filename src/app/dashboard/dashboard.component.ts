import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';





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
  chartOptions: any;
  chart: any;
  adminCount: any;
  chairCount: any;
  stakeCount: any;
  memberCount: any;
  approvedCount: any;
  pendingCount: any;
  returnedCount: any;

  statusCount: any;
  penCount: any;
  appCount: any;
  retCount: any;

  curriculum: any;
  currID: any;
  currVer: any;

  user = this.apiService.getUserDetails().subscribe(response => {
    console.log(response);
    this.userName = response.name;
    this.userType = response.userType;
  });

  constructor(private apiService: ApiService,
    private router: Router) { }

  ngOnInit(): void {
    this.getApprovedCurr();
    this.countFunc();
    // this.countUser();
    this.countCurrStat();
    this.countStatus();
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
          labels: ['Base Subject', 'Elective'],
          datasets: [{
            label: 'Subject',
            data: [this.subjectTotal, this.electiveTotal],
            backgroundColor: [
              'RoyalBlue ',
              'LightSteelBlue ',
            ],
            hoverOffset: 4
          }],
        },
        options: {
          aspectRatio: 2.5
        }

      });
    });
  }

  countCurrStat() {
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
          labels: ['Admin', 'Chairman', 'Member', 'StakeHolder'],
          datasets: [{
            label: 'Users',
            data: [this.adminCount, this.chairCount, this.memberCount, this.stakeCount],
            backgroundColor: [
              'RoyalBlue ',
              'LightSteelBlue ',
              'MidnightBlue ',
              'CornflowerBlue '
            ],
          }],
        },
        options: {
          aspectRatio: 2.5
        }

      });
    });
  }

  countStatus() {
    this.apiService.countCurrStatus().subscribe((data) => {
      this.statusCount = data;
      this.penCount = parseInt(this.statusCount.pending, 10);
      this.appCount = parseInt(this.statusCount.approved, 10);
      this.retCount = parseInt(this.statusCount.returned, 10);

      this.chart = new Chart("statusChart", {
        type: 'pie', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: ['Pending', 'Approved', "Returned"],
          datasets: [{
            label: 'Curriculum Status',
            data: [this.penCount, this.appCount, this.retCount],
            backgroundColor: [
              'RoyalBlue ',
              'LightSteelBlue ',
              'MidnightBlue '
            ],
          }],
        },
        options: {
          aspectRatio: 2.5
        }

      });
    });
  }

  getApprovedCurr() {
    this.apiService.getApprovedCurr().subscribe({
      next: (data) => {
        console.log("Display Successful", data);
        this.curriculum = data;
      },
      error: (err) => {
        console.log("Display Failed", err);
      }
    });
  }

  viewLatestCurriculum() {
    this.router.navigate([`/curriculum/${this.curriculum[0].id}/${this.curriculum[0].version_id}`]);
  }
}

