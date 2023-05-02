import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
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
    tempUserType: any;
    isTableVisible: boolean = true;
    isTableSubmittedVisible: boolean = true;
    buttons: any = [];
    columns: any = [];
    activeSubcategory = 'All';

    constructor(
        private apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.apiService.getUserDetails().subscribe(response => {
            this.tempUserType = response.userType;

            if (response.userType === 'admin' || response.userType === 'chair') {
                this.curriculumStatus();
            } else if (response.userType === 'stakeholder' || response.userType === 'member') {
                this.curriulumFeedback(Number(response.id));
            }
        });
    }

    // Display Tables for Admin And Committee Chair
    curriculumStatus() {

        // Show the CSV and PDF buttons for Admin and Committee Chair only.
        this.buttons = [
            {
                extend: 'csv',
                text: 'CSV',
                className: 'btn btn-primary',
                exportOptions: {
                    columns: ':visible:not(:nth-child(4))'
                }
            },
            {
                extend: 'print',
                text: 'PDF',
                className: 'btn btn-primary',
                exportOptions: {
                    columns: ':visible:not(:nth-child(4))'
                }
            },
        ];

        this.columns = [
            { data: 'id', title: 'ID' },
            { data: 'department', title: 'Department' },
            { data: 'version', title: 'Version Name' },
            { data: 'version_id', title: 'Version ID' },
            { data: 'date_and_time', title: 'Submission Date' },
            {
                data: 'curr_status', title: 'Status', render: function (data, type, row, meta) {
                    return data.toLowerCase().replace(/\b(\w)/g, function (s) { return s.toUpperCase(); });
                }
            },
            {
                data: null, title: 'Actions', render: (data, type, row) => {
                    return `
                        <a class="btn btn-primary btn-sm" href="status/${row.id}/${row.version_id}">
                            View
                        </a>
                    `;
                }
            }
        ];

        this.displayCurriculum();
    }

    // Display Tables for Stakeholder And Committee Member
    curriulumFeedback(id: number) {

        this.columns = [
            { data: 'id', title: 'ID' },
            { data: 'department', title: 'Department' },
            { data: 'version', title: 'Version Name' },
            { data: 'version_id', title: 'Version ID' },
            { data: 'date_and_time', title: 'Submission Date' },
            {
                data: 'is_approved', title: 'Feedbacks', render: function (data, type, row, meta) {
                    if (data === 1) {
                        return 'Approved';
                    } else if (data === 0) {
                        return 'Returned';
                    } else {
                        return 'Pending';
                    }
                }
            },
            {
                data: null, title: 'Actions', render: (data, type, row) => {
                    return `
                        <a class="btn btn-primary btn-sm" *ngIf="tempUserType === 'stakeholder'"
                            href="feedback/${row.id}/${row.version_id}">
                            Submit Feedback
                        </a>
                    `;
                }
            }
        ];

        this.getAllFeedbacks(id);
    }

    // Display the list of Curriculum for Admin and Committee Chair
    displayCurriculum() {
        this.apiService.displayCurriculum().subscribe({
            next: (data) => {
                // Manages the submissions array before display on the table
                console.log("Display Successful");
                this.curriculums = data;

                // Initialize the DataTable
                this.setDataTable();
            },
            error: (err) => {
                console.log("Display Failed", err);
            }
        });
    }

    // Display the list of Curriculum for Stakeholder and Committee Members
    getAllFeedbacks(id: number) {
        this.apiService.getAllFeedbacks(id).subscribe({
            next: (data) => {
                this.curriculums = data;
                // Initialize the DataTable
                this.setDataTable();
            },
            error: (err) => {
                console.log("Display Failed", err);
            }
        });
    }

    setDataTable() {
        let btn = this.buttons;
        let curr = this.curriculums;
        let columns = this.columns;
        // jQuery $(document).ready(function({})) is deprecated, Use $(function() {} instead.
        $(function () {
            $('#voteTable').DataTable({
                data: curr,
                dom: '<"row"<"top-left col-sm-6" f><"top-right d-flex justify-content-end col-sm-6"B>rt<"bottom"ip><"clear">',
                buttons: btn,
                "ordering": false,
                language: {
                    searchPlaceholder: "Find records..."
                },
                "pageLength": 10,
                columns: columns
            });
        });
    }

    setSubCategory(subcategory: string) {
        this.activeSubcategory = subcategory;
        if (this.tempUserType === 'admin' || this.tempUserType === 'chair') {
            this.refreshStatusTable();
        } else {
            this.refreshFeedbackTable();
        }
    }

    refreshStatusTable() {
        let currs = this.curriculums;
        if (this.activeSubcategory !== 'All') {
            currs = this.curriculums.filter(curriculum =>
                curriculum.curr_status == this.activeSubcategory.toLowerCase()
            );
        }
        $('#voteTable').DataTable().clear().rows.add(currs).draw();
    }

    refreshFeedbackTable() {
        let currs = this.curriculums;
        let status: number | null = null;
        if (this.activeSubcategory !== 'All') {
            if (this.activeSubcategory === 'Approved') {
                status = 1;
            } else if (this.activeSubcategory === 'Returned') {
                status = 0;
            }
            currs = this.curriculums.filter(curriculum =>
                curriculum.is_approved === status

            );
        }
        $('#voteTable').DataTable().clear().rows.add(currs).draw();
    }
}