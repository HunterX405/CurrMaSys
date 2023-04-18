import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Elective, TransformedElective } from '../elective';

@Component({
  selector: 'app-elective-subj',
  templateUrl: './elective-subj.component.html',
  styleUrls: ['./elective-subj.component.css']
})
export class ElectiveSubjComponent implements OnInit {
  // Used for the selection input field in the template
  subjects: any;
  // Used for holding the data on the ELECTIVE table
  electives: any;
  // Used for holding the new Array using transformArray()
  newElectives: any;

  file!: Blob;

  isTableVisible: boolean = true;
  isAddFormVisible: boolean = false;

  onAdd() {
    this.isAddFormVisible = !this.isAddFormVisible;
    this.isTableVisible = !this.isTableVisible;
  }


  // Form for Adding Elective Subject
  // Sub fb.group to group each elective data based on track
  addEleForm = this.fb.group({
    fkSubjID: ["", [Validators.required]],
    el1Data: this.fb.group({
      title: ["", [Validators.required]],
      syllabus: ["", [Validators.required]]
    }),
    el2Data: this.fb.group({
      title: ["", [Validators.required]],
      syllabus: ["", [Validators.required]]
    }),
    el3Data: this.fb.group({
      title: ['', [Validators.required]],
      syllabus: ['', [Validators.required]]
    })
  });

  constructor(private fb: FormBuilder,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.getSubjects();
    this.displayElectives();
  }

  onFileSelect(event: any) {
    this.file = event.target.files[0];
  }
  isFormSubmitted: boolean = false;
  isSuccess: boolean = false;
  // Getting data from the SUBJECT Table for SELECT input field on the template
  getSubjects() {
    this.apiService.displaySubjects().subscribe({
      next: (data) => {
        console.log("Get Subjects Successful");
        this.subjects = data;
      },
      error: (err) => {
        console.log("Display Failed");
        console.log(err);
      }
    });
  }

  // Displaying the electives from the ELECTIVE Table
  displayElectives() {
    this.apiService.displayElectives().subscribe({
      next: (data) => {
        console.log("Display Successful");
        this.electives = data;
        // Transform retrieve array into new array for displaying
        this.newElectives = this.transformArray(data);
      },
      error: (err) => {
        console.log("Display Failed");
        console.log(err);
      }
    });
  }

  // Add Elective
  addElectives() {
    console.log("@ addSubject");
    // Send Objects in the apiService.addElectives
    const { fkSubjID, el1Data, el2Data, el3Data } = this.addEleForm.value;

    if (this.addEleForm.valid) {
      this.apiService.addElectives(fkSubjID, el1Data, el2Data, el3Data).subscribe({
        next: (data) => {
          this.isSuccess = true;
          console.log("Adding Elective Successful", data);
          alert("Elective subjects added succesfully.");
          location.reload();
          // Loop is used to uploadFile because it returned 3 FileName
          for (let i = 0; i < data.length; i++) {
            this.apiService.uploadFile(this.file, data[i]);
          }
        },
        error: (err) => {
          console.log("Adding Elective Failed", err);
        }
      });
    }
    this.isFormSubmitted = true;
  }

  // Transforms the electives from the displaySubject.php into a new structure for ease of display.
  // Issue: If multiple elective subject has the same fk_subject_id, the older one will be overwritten.
  transformArray(oldArray: any) {
    const newArray = oldArray.reduce((acc: TransformedElective[], current: Elective) => {
      const index = acc.findIndex((item) => item.id === current.fk_subject_id);

      if (index === -1) {
        const newObject: TransformedElective = {
          id: current.fk_subject_id,
          course_code: current.course_code,
          title: current.title,
          SM: "",
          BA: "",
          WEB: "",
          SMID: 0,
          BAID: 0,
          WEBID: 0,
        };
        newObject[current.track] = current.elective_title;
        newObject[current.track + "ID"] = current.id;
        acc.push(newObject);
      } else {
        acc[index][current.track] = current.elective_title;
        acc[index][current.track + "ID"] = current.id;
      }

      return acc;
    }, []);

    return newArray;
  }

  get fkSubjID() { return this.addEleForm.value.fkSubjID };
  get el1Data() { return this.addEleForm.value.el1Data };
  get el2Data() { return this.addEleForm.value.el2Data };
  get el3Data() { return this.addEleForm.value.el3Data };
}