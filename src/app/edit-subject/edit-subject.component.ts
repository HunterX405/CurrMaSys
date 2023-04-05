import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})
export class EditSubjectComponent implements OnInit {
  subjectID: any;
  subjectData: any = "";
  // For determining if the user uploaded a new file
  isChanged: boolean = true;

  editSubForm = this.fb.group({
    courseCode: ["", [Validators.required]],
    title: ["", [Validators.required]],
    syllabus: [""],
  });

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private httpClient: HttpClient) { }


isFormSubmitted: boolean = false;
isSuccess: boolean = false;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.subjectID = params.get('id');
      this.apiService.getSubjectInfo(this.subjectID).subscribe({
        next: (data) => {
          console.log("Specific Subject Retrieved", data);
          this.subjectData = data;
          this.setFormValue();
        },
        error: (err) => {
          console.log("Specific Subject Failed", err);
        }
      })
    });
  }

  setFormValue() {
    // Setting-up the value of the form from the specific subject data
    this.editSubForm.get('courseCode')?.setValue(this.subjectData[0].course_code);
    this.editSubForm.get('title')?.setValue(this.subjectData[0].title);
    this.editSubForm.get('syllabus')?.setValue(this.subjectData[0].syllabus);
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.editSubForm.get("syllabus")?.setValue(file);
  }

  uploadFile(randomNumber: any) {
    const formData = new FormData();
    const file: any = this.editSubForm.get('syllabus')?.value;
    const newFileName = randomNumber + '-' + file.name;
    formData.append("myFile", file, newFileName);

    this.httpClient.post<any>("http://localhost/CurrMaSys/php/uploadFile.php", formData).subscribe(
      (data) => console.log("Upload File Successful", data),
      (err) => console.log("Upload File Failed", err)
    );
  }

  editSubject(editSubForm: FormGroup) {
    console.log("@ editSubject");
    let { courseCode, title, syllabus } = editSubForm.value;

    // For determining if the user uploaded a new file
    if (syllabus === this.subjectData[0].syllabus) {
      this.isChanged = false;
      syllabus = this.subjectData[0].syllabus;
      console.log(syllabus);
    }

    if (this.editSubForm.valid) {
      this.apiService.editSubject(this.subjectID, courseCode, title, syllabus, this.isChanged).subscribe({
        next: (data) => {
          console.log("Subject Editing Successful", data);
          // If the user uploaded a new file it will upload the new file
          if (this.isChanged) {
            this.isSuccess = true;
            this.uploadFile(data);
          }
        },
        error: (err) => {
          console.log("Subject Editing Failed", err);
        }
      });
    }
    this.isFormSubmitted = true;
  }

  get courseCode() { return this.editSubForm.value.courseCode };
  get title() { return this.editSubForm.value.title };
  get syllabus() { return this.editSubForm.value.syllabus };
}
