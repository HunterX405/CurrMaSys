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

  addSubForm = this.fb.group({
    courseCode: ["", [Validators.required]],
    title: ["", [Validators.required]],
    syllabus: ["", [Validators.required]],
  })

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private httpClient: HttpClient) { }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    console.log("@ onFileSelect", file.name);
    this.addSubForm.get("syllabus")?.setValue(file);
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

    this.apiService.addSubject(courseCode, title, syllabus).subscribe({
      next: (data) => {
        console.log("Subject Adding Successful");
        console.log(data);
      },
      error: (err) => {
        console.log("Subject Adding Failed");
        console.log(err);
      }
    });
  }

  // addSubject(addSubForm: FormGroup) {
  //   const { courseCode, title, syllabus } = addSubForm.value;

  //   this.apiService.addSubject(courseCode, title, syllabus).subscribe({
  //     next: (data) => {
  //       console.log("Subject Adding Successful");
  //       console.log(data);
  //     },
  //     error: (err) => {
  //       console.log("Subject Adding Failed");
  //       console.log(err);
  //     }
  //   });
  // }

  get courseCode() { return this.addSubForm.value.courseCode }
  get title() { return this.addSubForm.value.title }
  get syllabus() { return this.addSubForm.value.syllabus }
}
