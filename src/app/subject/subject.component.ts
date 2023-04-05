import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})

export class SubjectComponent {
  subjects: any;
  file!: Blob;

  addSubForm = this.fb.group({
    course_code: ["", [Validators.required]],
    title: ["", [Validators.required]],
    syllabus: ["", [Validators.required]],
  })

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    ) { }

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
      this.apiService.addSubject(course_code, title, syllabus).subscribe({
        next: (data) => {
          console.log("Subject Adding Successful", data);
          // The parameter is the generated number from the addSubject.php
          this.apiService.uploadFile(this.file, data.syllabus);
          location.reload();
        },
        error: (err) => {
          console.log("Subject Adding Failed", err);
        }
      });
    }
  }

  displaySubject() {
    this.apiService.displaySubjects().subscribe({
      next: (data) => {
        console.log("Display Successful", data);
        this.subjects = data;
      },
      error: (err) => {
        console.log("Display Failed");
        console.log(err);
      }
    });
  }
}
