import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-submit-feedback',
  templateUrl: './submit-feedback.component.html',
  styleUrls: ['./submit-feedback.component.css']
})
export class SubmitFeedbackComponent implements OnInit{
  // Store ID of the selected Curriculum and Logged in User
  curriculumID: any;
  userID: any;

  feedbackForm = this.fb.group({
    comment: ["", [Validators.required]],
    isApproved: ["", [Validators.required]]
  })

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Getting the ID of the Curriculum
    this.route.paramMap.subscribe(params => {
      this.curriculumID = params.get('id');
    });

    // Getting the ID of the Logged in User
    this.apiService.getUserDetails().subscribe(response => {
      this.userID = response.id;
    });
  }

  // Submits the Feedback on the Database
  addFeedback(feedbackForm: FormGroup) {
    const { comment, isApproved } = feedbackForm.value;

    this.apiService.addFeedback(comment, isApproved, this.userID, this.curriculumID).subscribe({
      next: (data) => {
        console.log("Adding Feedback Successful", data);
      },
      error: (err) => {
        console.log("Adding Feedback Failed", err);
      }
    });
  }

  get comment() { return this.feedbackForm.value.comment }
  get isApproved() { return this.feedbackForm.value.isApproved }
}
