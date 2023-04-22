import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../api.service';
import * as $ from 'jquery';
// import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
// import 'datatables.net-buttons/js/buttons.html5.js';
// import 'datatables.net-buttons/js/buttons.print.js';


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

  onAdd() {
    this.isAddFormVisible = !this.isAddFormVisible;
    this.isTableVisible = !this.isTableVisible;
  }

  onGoBack() {
    this.isAddFormVisible = !this.isAddFormVisible;
    this.isTableVisible = !this.isTableVisible;
    this.displaySubject();
  }

  addSubForm = this.fb.group({
    course_code: ["", [Validators.required]],
    title: ["", [Validators.required]],
    syllabus: ["", [Validators.required]]
  })

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
  ) { }

  isFormSubmitted: boolean = false;
  isSuccess: boolean = false;

  ngOnInit(): void {
    this.displaySubject();
  }

  onFileSelect(event: any) {
    this.file = event.target.files[0];
  }

  addSubject(addSubForm: FormGroup) {
    console.log("@ addSubject");
    const { course_code, title, syllabus } = addSubForm.value;

    if (addSubForm.valid) {
      this.apiService.addSubject(course_code, title, syllabus ).subscribe({
        next: (data) => {
          this.isSuccess = true;
          console.log("Subject Adding Successful", data);
          alert("Subject " + data.course_code + ": " + data.title + " added successfully.");
          // The parameter is the generated number from the addSubject.php
          this.apiService.uploadFile(this.file, data.syllabus);
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
        setTimeout(() => {
          // jQuery $(document).ready(function({})) is deprecated, Use $(function() {} instead.
          $(function() {
            $('#subjectsTable').DataTable( {
              dom: '<"row"<"top-left col-sm-6" f><"top-right d-flex justify-content-end col-sm-6"B>rt<"bottom"ip><"clear">',
              buttons: [
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
                  text: 'Print',
                  className: 'btn btn-primary',
                  exportOptions: {
                    columns: ':visible:not(:nth-child(4))'
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
        console.log("Display Failed");
        console.log(err);
      }
    });
  }
}
