import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-submit-feedback',
  templateUrl: './submit-feedback.component.html',
  styleUrls: ['./submit-feedback.component.css']
})
export class SubmitFeedbackComponent implements OnInit {
  // Store ID of the selected Curriculum and Logged in User
  curriculumID: any;
  userID: any;

  feedbackForm = this.fb.group({
    comment: [""],
    isApproved: ["", [Validators.required]]
  })
  // router: any;

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

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

  isFormSubmitted: boolean = false;
  isSuccess: boolean = false;
  isWrong: boolean = false;
  // Submits the Feedback on the Database
  addFeedback(feedbackForm: FormGroup) {
    const { comment, isApproved } = feedbackForm.value;
    if ((comment == "" && isApproved == 1) || (comment != "" && isApproved == 0)) {
      if (this.feedbackForm.valid) {
        this.apiService.addFeedback(comment, isApproved, this.userID, this.curriculumID).subscribe({
          next: (data) => {
            this.isSuccess = true;
            console.log("Adding Feedback Successful", data);
            alert("Feedback submitted.");
            this.router.navigate(['/vote']);
          },
          error: (err) => {
            console.log("Adding Feedback Failed", err);
          }
        });
      }
    }
    else if (isApproved == 1) {
      this.isWrong = false;
    }
    else {
      this.isWrong = true;
    }
    this.isFormSubmitted = true;
  }
  get comment() { return this.feedbackForm.value.comment }
  get isApproved() { return this.feedbackForm.value.isApproved }
}
