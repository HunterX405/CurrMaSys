import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-curr-feedback',
  templateUrl: './curr-feedback.component.html',
  styleUrls: ['./curr-feedback.component.css']
})
export class CurrFeedbackComponent implements OnInit {
  // Holds any CURRICULUM Data
  curriculumID: any;
  curriculumStatus: string = "";
  curriculumData: any;
  keys: any;

  // Holds FEEDBACK Data and length of FEEDBACK
  feedbacks: any;
  feedbackNum: number = 0;

  // Holds STAKEHOLDER Data and length of STAKEHOLDER
  stakeholders: any;
  stakeholderNum: number = 0;

  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.curriculumID = params.get('id');
    });

    this.getCurriculumInfo();
    this.getStakeholderNum();
    this.getFeedbacks();
  }

  // To get the data of a curriculum on the CURRICULUM Table
  getCurriculumInfo() {
    this.apiService.getCurriculumInfo(this.curriculumID).subscribe({
      next: (data) => {
        console.log("Curr Info Retrieved Successfully", data);
        this.curriculumData = data;
      },
      error: (err) => {
        console.log("Curr Info Retrieved Failed", err);
      }
    })
  }

  // To get the feedbacks based on CURRICULUM ID
  getFeedbacks() {
    this.apiService.getFeedbacks(this.curriculumID).subscribe({
      next: (data) => {
        console.log("Feedbacks Retrieved Successfully");
        this.feedbacks = data;
        this.feedbackNum = data.length;
      },
      error: (err) => {
        console.log("Feedbacks Retrieved Failed", err);
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

  onGoBack() {
    this.router.navigate(['/vote']);
  }

}
