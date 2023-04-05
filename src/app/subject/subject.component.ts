import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  subjects: any;

  addSubForm = this.fb.group({
    courseCode: ["", [Validators.required]],
    title: ["", [Validators.required]],
    syllabus: ["", [Validators.required]],
  })

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private httpClient: HttpClient) { }

    isFormSubmitted: boolean = false;
    isSuccess: boolean = false;
    
  ngOnInit(): void {
    this.displaySubject();
  }

  // Preparing the file that will be uploaded/moved
  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.addSubForm.get("syllabus")?.setValue(file);
  }

  // Uploads/Moves the file on the PDF folder (Located inside the PHP Folder)
  uploadFile(randomNumber: any) {
    const formData = new FormData();
    const file: any = this.addSubForm.get('syllabus')?.value;
    // Concatenate the generated number from the addSubject.php to create the same file name before uploading to the PDF foler
    const newFileName = randomNumber + '-' + file.name;
    formData.append("myFile", file, newFileName);

    this.httpClient.post<any>("http://localhost/CurrMaSys/php/uploadFile.php", formData).subscribe(
      (data) => console.log("Upload File Successful", data),
      (err) => console.log("Upload File Failed", err)
    );
  }




  addSubject(addSubForm: FormGroup) {
    console.log("@ addSubject");
    const { courseCode, title, syllabus } = addSubForm.value;

    if (addSubForm.valid) {
      this.apiService.addSubject(courseCode, title, syllabus).subscribe({
        next: (data) => {
          this.isSuccess = true;
          console.log("Subject Adding Successful", data);
          // The parameter is the generated number from the addSubject.php
          this.uploadFile(data.randomNumber);
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
        console.log("Display Successful");
        console.log(data);
        this.subjects = data;
      },
      error: (err) => {
        console.log("Display Failed");
        console.log(err);
      }
    });
  }

  get courseCode() { return this.addSubForm.value.courseCode }
  get title() { return this.addSubForm.value.title }
  get syllabus() { return this.addSubForm.value.syllabus }
}
