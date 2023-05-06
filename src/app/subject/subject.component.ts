import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import * as $ from 'jquery';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-subject',
    templateUrl: './subject.component.html',
    styleUrls: ['./subject.component.css']
})

export class SubjectComponent {
    subjects: any;
    file!: Blob;
    isTableVisible: boolean = true;
    isAddFormVisible: boolean = false;
    apiUrl: string = environment.apiUrl;
    buttons: any = [];

    // For SUBJECT TYPE Display
    subjectTypes = {
        "GE": "Gen. Education",
        "CC": "Common Courses",
        "ProfC": "Prof. Courses",
        "ProfE": "Prof. Electives",
        "PE": "PE",
        "NSTP": "NSTP"
    }

    onAdd() {
        this.isAddFormVisible = !this.isAddFormVisible;
        this.isTableVisible = !this.isTableVisible;
    }

    onGoBack() {
        this.isAddFormVisible = !this.isAddFormVisible;
        this.isTableVisible = !this.isTableVisible;
        this.displaySubject();
    }

    // Remove Validators.required for Syllabus
    addSubForm = this.fb.group({
        course_code: ["", [Validators.required]],
        title: ["", [Validators.required]],
        syllabus: [""],
        subjType: ["", [Validators.required]],
        description: ["", [Validators.required]]
    })

    constructor(private fb: FormBuilder,
        private apiService: ApiService,
    ) { }

    isFormSubmitted: boolean = false;
    isSuccess: boolean = false;

    ngOnInit(): void {
        this.apiService.getUserDetails().subscribe(response => {
            // Show the CSV and PDF buttons for authorized user types only.
            if (response.userType === 'admin' || response.userType === 'chair') {
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
            }
        });
        this.displaySubject();
    }

    onFileSelect(event: any) {
        this.file = event.target.files[0];
    }

    addSubject(addSubForm: FormGroup) {
        console.log("@ addSubject");
        const { course_code, title, syllabus, subjType, description } = addSubForm.value;

        if (addSubForm.valid) {
            this.apiService.addSubject(course_code, title, syllabus, subjType, description).subscribe({
                next: (data) => {
                    this.isSuccess = true;
                    console.log("Subject Adding Successful", data);
                    alert("Subject " + data.course_code + ": " + data.title + " added successfully.");
                    // The parameter is the generated number from the addSubject.php
                    // Will be called if the user uploaded a file
                    if (this.file) {
                        this.apiService.uploadFile(this.file, data.syllabus);
                    }
                    location.reload();
                },
                error: (err) => {
                    console.log("Subject Adding Failed", err);
                }
            });
        }
        this.isFormSubmitted = true;
    }



    displaySubject() {
        this.apiService.displaySubjects().subscribe({
          next: (data) => {
            console.log("Display Successful", data);
            this.subjects = data;
            let btn = this.buttons;
            setTimeout(() => {
              // jQuery $(document).ready(function({})) is deprecated, Use $(function() {} instead.
              $(function () {
                const table = $('#subjectsTable').DataTable({
                  dom: '<"row"<"top-left col-sm-6" f><"top-right d-flex justify-content-end col-sm-6"B>rt<"bottom"ip><"clear">',
                  buttons: btn,
                  "ordering": false,
                  language: {
                    searchPlaceholder: "Find records..."
                  },
                  "pageLength": 10,
                });
      
                // Create the dropdown filter
                const select = $('<select id="subjectType" class="mx-2 p-2"><option value="">All</option></select>')
                  .on('change', function() {
                    const val = $(this).val();
                    table.column(2).search(val ? '^' + val + '$' : '', true, false).draw();
                  });
      
                // Populate the dropdown with options from the "Subject Type" column
                table.column(2).data().unique().sort().each(function (d, j) {
                  select.append('<option value="' + d + '">' + d + '</option>');
                });
      
                // Add the label and filter to the DataTable DOM
                $('#subjectsTable_filter').append('<label for="subjectType" style="margin-right:10px; margin-left:15px;"><strong>Subject Type:</strong></label>').append(select);
              });
            }, 0);
          },
          error: (err) => {
            console.log("Display Failed");
            console.log(err);
          }
        });
      }
}
