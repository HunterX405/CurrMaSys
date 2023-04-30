import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
   selector: 'app-submit-feedback',
   templateUrl: './submit-feedback.component.html',
   styleUrls: ['./submit-feedback.component.css']
})
export class SubmitFeedbackComponent implements OnInit {
   // Store ID of the selected Curriculum and Logged in User
   curriculumID!: any;
   curriculumVer!: any;
   curriculumStatus: string = "";
   keys: any;

   // Holds FEEDBACK Data and length of FEEDBACK
   feedbacks: any;
   feedbackNum: number = 0;

   // Holds STAKEHOLDER Data and length of STAKEHOLDER
   stakeholders: any;
   stakeholderNum: number = 0;

   userID: any;
   haveSubmitted: boolean = false;

   feedbackForm = this.fb.group({
      comment: [""],
      isApproved: ["", [Validators.required]]
   })

   approve: boolean = false;
   returned: boolean = false;

   constructor(private fb: FormBuilder,
      private apiService: ApiService,
      private route: ActivatedRoute,
      private router: Router) { }

   ngOnInit(): void {
      // Getting the ID of the Curriculum
      this.route.paramMap.subscribe(params => {
         this.curriculumID = Number(params.get('id'));
         this.curriculumVer = Number(params.get('ver'));
      });

      // Getting the ID of the Logged in User
      this.apiService.getUserDetails().subscribe(response => {
         this.userID = response.id;

         this.determineUser(this.curriculumID, this.curriculumVer, this.userID);
      });
   }

   isFormSubmitted: boolean = false;
   isSuccess: boolean = false;
   isWrong: boolean = false;

   // Submits the Feedback on the Database
   addFeedback(feedbackForm: FormGroup) {
      const { comment, isApproved } = feedbackForm.value;

      if ((isApproved == 1) || (comment != "" && isApproved == 0)) {
         if (this.feedbackForm.valid) {
            this.apiService.addFeedback(comment, isApproved, this.userID, this.curriculumID, this.curriculumVer, this.haveSubmitted).subscribe({
               next: (data) => {
                  this.isSuccess = true;
                  console.log("Adding Feedback Successful", data);

                  this.getStakeholderNum();
                  this.updateStatus(this.curriculumID, this.curriculumVer);

                  alert("Feedback submitted.");
                  this.router.navigate(['/vote']);
               },
               error: (err) => {
                  console.log("Adding Feedback Failed", err);
               }
            });
         }
      } else if (isApproved == 1) {
         this.isWrong = false;
      } else {
         this.isWrong = true;
      }
      this.isFormSubmitted = true;
   }

   // To validate if the USER have already submitted a FEEDBACK
   validateSubmit(curriculumData: any, keys: any, userID: number) {
      for (let i = 0; i < curriculumData.length; i++) {
         // To iterate the keys of the curriculumData Object
         for (let j = 0; j < keys.length; j++) {
            const key = keys[j];

            if (key === "fk_vote_user_id") {
               // To check if the current feedback with an key of "is_approved" has a value of 0
               if (curriculumData[i][key] == userID) {
                  return true;
               }
            }
         }
      }
      return false;
   }

   determineUser(currID: number, currVer: number, userID: number) {
      this.apiService.getFeedbacks(currID, currVer).subscribe({
         next: (data) => {
            const feedbacks = data;
            const keys = Object.keys(data[0]);
            console.log(data);

            this.haveSubmitted = this.validateSubmit(feedbacks, keys, userID);
            console.log("haveSubmitted", this.haveSubmitted);

            if (this.haveSubmitted === true) {
               this.feedbackForm.get("comment")?.setValue(this.getComment(feedbacks, keys, userID));
               this.feedbackForm.get("isApproved")?.setValue(this.getRadio(feedbacks, keys, userID));
               if (this.isApproved == "1") {
                  this.approve = true;
               } else {
                  this.returned = true;
               }
            }
         },
         error: (err) => {
            console.log("Failed to validate user", err);
         }
      });
   }

   getStakeholderNum() {
      this.apiService.getStakeholderNum().subscribe({
         next: (data) => {
            this.stakeholders = data;
            this.stakeholderNum = this.stakeholders.length;
         },
         error: (err) => {
            console.log("Failed to get Stakeholder Data", err);
         }
      });
   }

   updateStatus(curriculumID: number, curriculumVer: number) {
      this.apiService.getFeedbacks(curriculumID, curriculumVer).subscribe({
         next: (data) => {
            this.feedbacks = data;
            this.feedbackNum = data.length;
            this.keys = Object.keys(this.feedbacks[0]);

            this.curriculumStatus = this.apiService.getCurriculumStatus(this.feedbacks, this.keys, this.stakeholderNum, this.feedbackNum);

            this.apiService.updateStatus(curriculumID, curriculumVer, this.curriculumStatus).subscribe({
               next: (data) => {
                  console.log("Update Success", data);
               },
               error: (err) => {
                  console.log("Update Failed", err);
               }
            });
         },
         error: (err) => {
            console.log("Failed to validate user", err);
         }
      });
   }

   // To get the comment of the USER if they already submitted a FEEDBACK
   getComment(curriculumData: any, keys: any, userID: any) {
      for (let i = 0; i < curriculumData.length; i++) {
         // To iterate the keys of the curriculumData Object
         for (let j = 0; j < keys.length; j++) {
            const key = keys[j];

            if (key === "fk_vote_user_id") {
               if (curriculumData[i][key] == userID) {
                  return curriculumData[i]["comment"];
               }
            }
         }
      }
   }

   getRadio(curriculumData: any, keys: any, userID: any) {
      for (let i = 0; i < curriculumData.length; i++) {
         // To iterate the keys of the curriculumData Object
         for (let j = 0; j < keys.length; j++) {
            const key = keys[j];

            if (key === "fk_vote_user_id") {
               if (curriculumData[i][key] == userID) {
                  return curriculumData[i]["is_approved"];
               }
            }
         }
      }
   }

   get comment() { return this.feedbackForm.value.comment }
   get isApproved() { return this.feedbackForm.value.isApproved }

   goBack() {
      this.router.navigate(['/vote']);
   }

   viewCurriculum() {
      window.open(`/curriculum/${this.curriculumID}/${this.curriculumVer}`, "_blank");
   }
}
