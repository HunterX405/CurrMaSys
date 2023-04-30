import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import * as $ from 'jquery';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
    // Holds all data from CURRICULUM Table
    curriculums: any;
    // Holds all data from VOTE Table
    allFeedbacks: any;
    tempUserType: any;
    // Holds userID from getUserDetails Service
    userID: any;

    submissions: any = [];

    isTableVisible: boolean = true;
    isTableSubmittedVisible: boolean = true;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.getAllFeedbacks();
        this.apiService.getUserDetails().subscribe(response => {
            this.tempUserType = response.userType;
            this.userID = response.id;
            this.displayCurriculum(response.id);
        });
    }

    // Display the list of Curriculum for Stakeholders
    // Has userID parameter only for the checkSubmission Function
    displayCurriculum(userID: any) {
        this.apiService.displayCurriculum().subscribe({
            next: (data) => {
                // Manages the submissions array before display on the table
                this.checkSubmission(userID, data, this.allFeedbacks);

                console.log("Display Successful");
                this.curriculums = data;
                setTimeout(() => {
                    // jQuery $(document).ready(function({})) is deprecated, Use $(function() {} instead.
                    $(function () {
                        $('#voteTable').DataTable({
                            dom: '<"row"<"top-left col-sm-6" f><"top-right d-flex justify-content-end col-sm-6"B>rt<"bottom"ip><"clear">',

                            buttons: [
                                {
                                    extend: 'csv',
                                    text: 'CSV',
                                    className: 'btn btn-primary',
                                    exportOptions: {
                                        columns: ':visible:not(:nth-child(5))'
                                    }
                                },
                                {
                                    extend: 'print',
                                    text: 'PDF',
                                    className: 'btn btn-primary',
                                    exportOptions: {
                                        columns: ':visible:not(:nth-child(5))'
                                    }
                                },
                            ],
                            "ordering": false,
                            language: {
                                searchPlaceholder: "Find records..."
                            },
                            "pageLength": 10,

                        });
                    });
                }, 0);
            },
            error: (err) => {
                console.log("Display Failed", err);
            }
        });
    }

    // Get all data from the VOTE Table without filter based on USER ID
    getAllFeedbacks() {
        this.apiService.getAllFeddbacks().subscribe({
            next: (data) => {
                this.allFeedbacks = data;
                console.log('feedback', data);
            },
            error: (err) => {
                console.log("Display Failed", err);
            }
        });
    }

    // To check IF the USER have submitted a FEEDBACK on a CURRICULUM
    checkSubmission(userID: any, curriculums: any, feedbacks: any) {
        // check if feedbacks has been initialized
        if (feedbacks) {
            // Access the CURRICULUM Table
            for (const curriculum of curriculums) {
                let tempChecker = 0;

                feedbacks.forEach(feedback => {
                    // Check IF the current feedback has the current CURRICULUM ID and USER ID
                    if (feedback.fk_vote_user_id === userID && feedback.fk_vote_curr_id === curriculum.id && feedback.curr_ver === curriculum.version_id) {
                        tempChecker = 1;
                        this.submissions.push("Submitted");
                        // break;
                    }
                });
                // Access the VOTE Table
                // for (let feedback of feedbacks) {
                //     // Check IF the current feedback has the current CURRICULUM ID and USER ID
                //     if (feedback.fk_vote_user_id === userID && feedback.fk_vote_curr_id === curriculum.id && feedback.curr_ver === curriculum.version_id) {
                //         tempChecker = 1;
                //         this.submissions.push("Submitted");
                //         break;
                //     }
                // }

                // To identify if the USER have not submitted a feedback
                if (tempChecker === 0) {
                    tempChecker = 0;
                    this.submissions.push("Not Submitted");
                }
            }
        }
    }
}