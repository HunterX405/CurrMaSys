import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent {
  subjects: any;
  file!: Blob;

  addSubForm = this.fb.group({
    courseCode: ["", [Validators.required]],
    title: ["", [Validators.required]],
    syllabus: ["", [Validators.required]],
  })

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private httpClient: HttpClient) { }

  onFileSelect(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    const formData = new FormData();
    let fileName: any = this.addSubForm.get('syllabus')?.value;
    formData.append("myFile", fileName);

    console.log("@ uploadFile");

    this.httpClient.post<any>("http://localhost/CurrMaSys/php/uploadFile.php", formData).subscribe(
      (data) => console.log("Upload File Successful"),
      (err) => console.log("Upload File Failed")
    );
  }

  addSubject(addSubForm: FormGroup) {
    // this.uploadFile();
    console.log("@ addSubject");
    this.addSubForm.get("syllabus")?.setValue("");
    const { courseCode, title, syllabus } = addSubForm.value;

    if (addSubForm.valid) {
      this.apiService.addSubject(courseCode, title, syllabus).subscribe({
        next: (data) => {
          console.log("Subject Adding Successful", data);
          // The parameter is the generated number from the addSubject.php
          this.apiService.uploadFile(this.file,data.syllabus);
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
        console.log("Subject Adding Failed");
        console.log(err);
      }
    });
  }
}
