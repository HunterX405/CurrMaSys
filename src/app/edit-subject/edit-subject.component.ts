import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})

export class EditSubjectComponent implements OnInit {

  subjectID: any;
  file!: Blob;
  oldFileName: string = '';

  editSubForm = this.fb.group({
    courseCode: ["", [Validators.required]],
    title: ["", [Validators.required]],
    syllabus: [""],
  });

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.subjectID = params.get('id');
      this.apiService.getSubjectInfo(this.subjectID).subscribe({
        next: (data) => {
          console.log("Specific Subject Retrieved", data);
          this.oldFileName = data[0].syllabus;
          this.setFormValue(data[0]);
        },
        error: (err) => {
          console.log("Specific Subject Failed", err);
        }
      })
    });
  }

  setFormValue(data: any) {
    // Setting-up the value of the form from the specific subject data
    this.editSubForm.get('courseCode')?.setValue(data.course_code);
    this.editSubForm.get('title')?.setValue(data.title);
  }

  onFileSelect(event: any) {
    this.file = event.target.files[0];
  }

  editSubject(editSubForm: FormGroup) {
    let { courseCode, title, syllabus } = editSubForm.value;

    if (this.editSubForm.valid) {
      this.apiService.editSubject(this.subjectID, courseCode, title, syllabus).subscribe({
        next: (data) => {
          console.log("Subject Editing Successful", data);
          // If the user uploaded a new file it will upload the new file
          if (data.fileName) {
            this.apiService.uploadFile(this.file, data.fileName, this.oldFileName);
          }
          alert("Subject " + courseCode +" Edited Successfully");
          this.router.navigate(['/subject']);
        },
        error: (err) => {
          console.log("Subject Editing Failed", err);
        }
      });
    }
  }
}
