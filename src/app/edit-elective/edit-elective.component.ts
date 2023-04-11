import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-elective',
  templateUrl: './edit-elective.component.html',
  styleUrls: ['./edit-elective.component.css']
})
export class EditElectiveComponent implements OnInit {
  // Used for holding ID of the selected elective on the ElectiveComponent
  electiveID: any;
  // Used for holding the track of the selected elective on the ElectiveComponent
  electiveTrack: string = "";
  // Used for displaying the complete version of track based on the electiveTrack
  tracks: any = {
    "SM": "Service Management Specialization Track",
    "BA": "Business Analytics Specialization Track",
    "WEB": "Web and Mobile Development Specialization Track"
  }

  file!: Blob;
  oldFileName: string = '';

  editEleForm = this.fb.group({
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
      this.electiveID = params.get('id');
      this.apiService.getElectiveInfo(this.electiveID).subscribe({
        next: (data) => {
          console.log("Specific Elective Retrieved", data);
          this.electiveTrack = data?.track;
          this.oldFileName = data?.elective_syllabus;
          this.setFormValue(data);
        },
        error: (err) => {
          console.log("Specific Elective Failed", err);
        }
      })
    });
  }

  setFormValue(data: any) {
    // Setting-up the value of the form from the specific subject data
    this.editEleForm.get('title')?.setValue(data.elective_title);
  }

  onFileSelect(event: any) {
    this.file = event.target.files[0];
  }

  editSubject(editSubForm: FormGroup) {
    let { title, syllabus } = editSubForm.value;

    if (this.editEleForm.valid) {
      this.apiService.editElective(this.electiveID, title, syllabus).subscribe({
        next: (data) => {
          console.log("Elective Editing Successful", data);

          // If the user uploaded a new file it will upload the new file
          if (data.fileName) {
            this.apiService.uploadFile(this.file, data.fileName, this.oldFileName);
          }
          alert("Edited Successfully");
          this.router.navigate(['/elective']);
        },
        error: (err) => {
          console.log("Subject Editing Failed", err);
        }
      });
    }
  }
}
