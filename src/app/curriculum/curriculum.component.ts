import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
   selector: 'app-curriculum',
   templateUrl: './curriculum.component.html',
   styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {

   constructor(
      private fb: FormBuilder,
      private apiService: ApiService
   ) { }

   isTableVisible: boolean = true;
   curriculums: any;
   subjectsList: any;
   curriculumForm!: FormGroup;
   subjectsArray: any;
   isFormSet: boolean = false;

   ngOnInit(): void {
      this.displayCurriculum();
   }

   displayCurriculum() {
      this.apiService.displayCurriculum().subscribe({
         next: (data) => {
            console.log("Display Successful");
            this.curriculums = data;
         },
         error: (err) => {
            console.log("Display Failed", err);
         }
      });
   }

   setForm() {
      console.log('@setForm')
      this.curriculumForm = this.fb.group({
         department: ['',Validators.required],
         version: ['',Validators.required],
         firstYearFirstSemSubjects: this.fb.array([]),
         firstYearSecondSemSubjects: this.fb.array([]),
         secondYearFirstSemSubjects: this.fb.array([]),
         secondYearSecondSemSubjects: this.fb.array([]),
         thirdYearFirstSemSubjects: this.fb.array([]),
         thirdYearSecondSemSubjects: this.fb.array([]),
         fourthYearFirstSemSubjects: this.fb.array([]),
         fourthYearSecondSemSubjects: this.fb.array([]),
      });

      this.subjectsArray = [
         { 'form': 'firstYearFirstSemSubjects', 'array': this.firstYearFirstSemArray, 'yearTitle': 'FIRST', 'semTitle': 'FIRST' },
         { 'form': 'firstYearSecondSemSubjects', 'array': this.firstYearSecondSemArray, 'yearTitle': 'FIRST', 'semTitle': 'SECOND' },
         { 'form': 'secondYearFirstSemSubjects', 'array': this.secondYearFirstSemArray, 'yearTitle': 'SECOND', 'semTitle': 'FIRST' },
         { 'form': 'secondYearSecondSemSubjects', 'array': this.secondYearSecondSemArray, 'yearTitle': 'SECOND', 'semTitle': 'SECOND' },
         { 'form': 'thirdYearFirstSemSubjects', 'array': this.thirdYearFirstSemArray, 'yearTitle': 'THIRD', 'semTitle': 'FIRST' },
         { 'form': 'thirdYearSecondSemSubjects', 'array': this.thirdYearSecondSemArray, 'yearTitle': 'THIRD', 'semTitle': 'SECOND' },
         { 'form': 'fourthYearFirstSemSubjects', 'array': this.fourthYearFirstSemArray, 'yearTitle': 'FOURTH', 'semTitle': 'FIRST' },
         { 'form': 'fourthYearSecondSemSubjects', 'array': this.fourthYearSecondSemArray, 'yearTitle': 'FOURTH', 'semTitle': 'SECOND' },
      ];

      this.apiService.displaySubjects().subscribe({
         next: (data) => {
            console.log("Get Subjects", data);
            this.subjectsList = data;
         },
         error: (err) => {
            console.log("Get Subjects Failed");
            console.log(err);
         }
      });
   }

   onAdd() {
      if (!this.isFormSet) {
         this.setForm();
         this.isFormSet = true;
      }
      this.isTableVisible = !this.isTableVisible;
   }

   onGoBack() {
      this.isTableVisible = !this.isTableVisible;
   }

   get firstYearFirstSemArray() {
      return <FormArray>this.curriculumForm.get('firstYearFirstSemSubjects');
   }
   get firstYearSecondSemArray() {
      return <FormArray>this.curriculumForm.get('firstYearSecondSemSubjects');
   }
   get secondYearFirstSemArray() {
      return <FormArray>this.curriculumForm.get('secondYearFirstSemSubjects');
   }
   get secondYearSecondSemArray() {
      return <FormArray>this.curriculumForm.get('secondYearSecondSemSubjects');
   }
   get thirdYearFirstSemArray() {
      return <FormArray>this.curriculumForm.get('thirdYearFirstSemSubjects');
   }
   get thirdYearSecondSemArray() {
      return <FormArray>this.curriculumForm.get('thirdYearSecondSemSubjects');
   }
   get fourthYearFirstSemArray() {
      return <FormArray>this.curriculumForm.get('fourthYearFirstSemSubjects');
   }
   get fourthYearSecondSemArray() {
      return <FormArray>this.curriculumForm.get('fourthYearSecondSemSubjects');
   }

   createSubject() {
      return this.fb.group({
         course: ['', Validators.required],
         lec_units: [0, [Validators.min(0), Validators.max(3), Validators.required]],
         lab_units: [0, [Validators.min(0), Validators.max(3), Validators.required]],
         total_units: [0, [Validators.min(0), Validators.max(5)]],
         hrs: [0, Validators.required],
         pre_req: '',
         co_req: '',
      });
   }

   addNewSubject(subjects: FormArray) {
      let formGroup = this.createSubject();
      subjects.push(formGroup);
   }

   deleteSubject(i: number, subjects: FormArray) {
      subjects.removeAt(i);
   }

   getTotalUnits(id: number, subjects: FormArray) {
      // let subject: any = this.curriculumForm.value.firstYearFirstSemArray[id];
      let lab = subjects.at(id).get('lab_units')?.value;
      let lec = subjects.at(id).get('lec_units')?.value;
      subjects.at(id).get('total_units')?.setValue(lab + lec);
   }

   addCurriculum(curriculumForm: FormGroup) {
      console.log("@ addCurriculum");

      if (curriculumForm.valid) {
         this.apiService.addCurriculum(JSON.stringify(curriculumForm.value)).subscribe({
            next: (data) => {
               console.log("Curriculum Added Successfully", data);
               alert("Curriculum_id " + data.curr_id + " added successfully.");
               // The parameter is the generated number from the addSubject.php
               location.reload();
            },
            error: (err) => {
               console.log("Curriculum Adding Failed", err);
            }
         });
      }
   }
}
