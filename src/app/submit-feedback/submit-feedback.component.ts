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
    userID: any;
    isFormSubmitted: boolean = false;
    feedbackForm!: FormGroup;

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
        });

        this.feedbackForm = this.fb.group({
            userId: this.userID,
            currId: this.curriculumID,
            currVer: this.curriculumVer,
            haveSubmitted: false,
            comment: [""],
            isApproved: ["", [Validators.required]]
        })


        this.setFormValues(this.curriculumID, this.curriculumVer, this.userID);
    }

    goBack() {
        this.router.navigate(['/vote']);
    }

    viewCurriculum() {
        window.open(`/curriculum/${this.curriculumID}/${this.curriculumVer}`, "_blank");
    }

    setFormValues(curr_id: number, curr_ver: number, user: number) {
        this.apiService.getUserFeedback(curr_id, curr_ver, user).subscribe({
            next: (data) => {
                if (data[0]) {
                    this.feedbackForm.get('haveSubmitted')?.setValue(true);
                    this.feedbackForm.get('isApproved')?.setValue(String(data[0].is_approved));
                    this.feedbackForm.get('comment')?.setValue(data[0].comment);
                    this.feedbackForm.get('isApproved')?.getRawValue()
                }
            },
            error: (err) => {
                console.log("Failed to validate user", err);
            }
        });
    }

    addFeedback(feedbackForm: FormGroup) {
        if ((this.feedbackForm.get('isApproved')?.value === '0' && this.feedbackForm.get('comment')?.getRawValue() !== '') || this.feedbackForm.get('isApproved')?.value === '1') {
            if (feedbackForm.valid) {
                this.apiService.addFeedback(JSON.stringify(feedbackForm.value)).subscribe({
                    next: (data) => {
                        console.log(data['status'], " Feedback Successfully");
                        alert("Feedback submitted.");
                        this.router.navigate(['/vote']);
                        this.updateStatus();
                    },
                    error: (err) => {
                        console.log("Adding Feedback Failed", err);
                    }
                });
            }
        }
        this.isFormSubmitted = true;
    }

    updateStatus() {
        console.log("@ updateStatus");
        this.apiService.updateStatus(this.curriculumID, this.curriculumVer).subscribe({
            next(data) {
                console.log('Curriculum Status: ', data['status']);
            },
            error(err) {
                console.log("Failed to update curriculum status", err);
            }
        });
    }

}
