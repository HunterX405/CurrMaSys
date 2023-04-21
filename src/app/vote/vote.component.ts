import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit{
  curriculums: any;
  stakeholders: any;
  voteCounts: any;
  stakeholderNum: any;

  tempUserType: any;

  isTableVisible: boolean = true;
  isTableSubmittedVisible: boolean = true;



  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.displayCurriculum();
    this.getStakeholderNum();

    this.apiService.getUserDetails().subscribe(response => {
      this.tempUserType = response.userType;
    });

    this.apiService.getAllStatus().subscribe({
      next: (data) => {
        console.log("getAllStatus Successful", data);
      },
      error: (err) => {
        console.log("getAllStatus Failed", err);
      }
    })
  }

  // Display the list of Curriculum for Stakeholders
  displayCurriculum() {
    this.apiService.displayCurriculum().subscribe({
      next: (data) => {
        console.log("Display Successful");
        this.curriculums = data;
      },
      error: (err) => {
        console.log("Display Failed", err);
      }
    });
  }

  // Get the data of all the Stakeholder Accounts
  getStakeholderNum() {
    this.apiService.getStakeholderNum().subscribe({
      next: (data) => {
        console.log("Successful to get Stakeholder Data");
        this.stakeholders = data;
        // Get the number of Stakeholder Accounts
        this.stakeholderNum = this.stakeholders.length;
      },
      error: (err) => {
        console.log("Failed to get Stakeholder Data", err);
      }
    });
  }
}
