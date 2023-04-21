import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-curr-feedback',
  templateUrl: './curr-feedback.component.html',
  styleUrls: ['./curr-feedback.component.css']
})
export class CurrFeedbackComponent implements OnInit {
  // Holds any CURRICULUM Data
  curriculumID: any;
  curriculumStatus: string | undefined;
  keys: any;

  // Holds FEEDBACK Data
  feedbacks: any;
  // Holds the length of FEEDBACK
  feedbackNum: number = 0;

  // Holds STAKEHOLDER Data
  stakeholders: any;
  // Holds the length of STAKEHOLDER
  stakeholderNum: number = 0;

  constructor(private apiService: ApiService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.curriculumID = params.get('id');
    });

    this.getStakeholderNum();
    this.getFeedbacks();
  }

  // To get the feedbacks based on CURRICULUM ID
  getFeedbacks() {
    this.apiService.getFeedbacks(this.curriculumID).subscribe({
      next: (data) => {
        console.log("Feedbacks Retrieved Successfully");
        this.feedbacks = data;
        this.feedbackNum = data.length;

        this.keys = Object.keys(this.feedbacks[0]);

        this.curriculumStatus = this.apiService.getCurriculumStatus(this.feedbacks, this.keys, this.stakeholderNum, this.feedbackNum);
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
}
