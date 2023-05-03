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
    curriculumVer: any;
    curriculumData: any;

    // Holds FEEDBACK Data and length of FEEDBACK
    feedbacks: any;
    feedbackNum: number = 0;

    // Holds the count of stakeholders
    stakeholderNum: number = 0;

    // For showing only the print part of the page
    isPrint: boolean = false;

    constructor(private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.curriculumID = params.get('id');
            this.curriculumVer = params.get('ver');
        });

        this.getCurriculumInfo();
        this.getStakeholderNum();
        this.getFeedbacks();

        window.onafterprint = (event) => {
            this.isPrint = false;
        };
    }

    // To get the data of a curriculum on the CURRICULUM Table
    getCurriculumInfo() {
        this.apiService.getCurriculumInfo(this.curriculumID, this.curriculumVer).subscribe({
            next: (data) => {
                console.log("Curr Info Retrieved Successfully");
                this.curriculumData = data;
            },
            error: (err) => {
                console.log("Curr Info Retrieved Failed", err);
            }
        })
    }

    // To get the feedbacks based on CURRICULUM ID
    getFeedbacks() {
        this.apiService.getFeedbacks(this.curriculumID, this.curriculumVer).subscribe({
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
                console.log("Stakeholder Count", data);
                // Get the number of Stakeholder Accounts
                this.stakeholderNum = data;
            },
            error: (err) => {
                console.log("Failed to get Stakeholder Data", err);
            }
        });
    }

    onGoBack() {
        this.router.navigate(['/vote']);
    }

    viewCurriculum() {
        window.open(`/curriculum/${this.curriculumID}/${this.curriculumVer}`, "_blank");
    }

    printCurriculum() {
        this.isPrint = true;
        setTimeout(() => {
            window.print();
        }, 1000);
    }
}
