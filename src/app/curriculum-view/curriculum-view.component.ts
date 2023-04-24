import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
   selector: 'app-curriculum-view',
   templateUrl: './curriculum-view.component.html',
   styleUrls: ['./curriculum-view.component.css']
})
export class CurriculumViewComponent implements OnInit {

   constructor(
      private fb: FormBuilder,
      private apiService: ApiService,
      private route: ActivatedRoute
   ) { }

   isTableVisible: boolean = true;
   curriculum: any;
   subjectsList: any;
   curriculumForm!: FormGroup;
   subjectsArray: any;
   isFormSet: boolean = false;
   yearSem: any;
   firstYearFirstSem: any;
   firstYearSecondSem: any;
   secondYearFirstSem: any;
   secondYearSecondSem: any;
   thirdYearFirstSem: any;
   thirdYearSecondSem: any;
   fourthYearFirstSem: any;
   fourthYearSecondSem: any;
   currId: any;

   ngOnInit(): void {
      // Getting the ID of the Curriculum
      this.route.paramMap.subscribe(params => {
         this.currId = Number(params.get('id'));
         this.displayCurriculum(this.currId);
      });
   }

   displayCurriculum(currId: number) {
      this.apiService.getCurriculum(currId).subscribe({
         next: (data) => {
            console.log("Get Curriculum Success", data);
            this.curriculum = data.curriculum;
            this.firstYearFirstSem = data.subjects.filter(subject => subject.year === 1 && subject.semester === 1);
            this.firstYearSecondSem = data.subjects.filter(subject => subject.year === 1 && subject.semester === 2);
            this.secondYearFirstSem = data.subjects.filter(subject => subject.year === 2 && subject.semester === 1);
            this.secondYearSecondSem = data.subjects.filter(subject => subject.year === 2 && subject.semester === 2);
            this.thirdYearFirstSem = data.subjects.filter(subject => subject.year === 3 && subject.semester === 1);
            this.thirdYearSecondSem = data.subjects.filter(subject => subject.year === 3 && subject.semester === 2);
            this.fourthYearFirstSem = data.subjects.filter(subject => subject.year === 4 && subject.semester === 1);
            this.fourthYearSecondSem = data.subjects.filter(subject => subject.year === 4 && subject.semester === 2);
            this.yearSem = [
               { 'yearTitle': 'FIRST', 'sem1': this.firstYearFirstSem, 'sem2': this.firstYearSecondSem },
               { 'yearTitle': 'SECOND', 'sem1': this.secondYearFirstSem, 'sem2': this.secondYearSecondSem },
               { 'yearTitle': 'THIRD', 'sem1': this.thirdYearFirstSem, 'sem2': this.thirdYearSecondSem },
               { 'yearTitle': 'FOURTH', 'sem1': this.fourthYearFirstSem, 'sem2': this.fourthYearSecondSem },
            ];
         },
         error: (err) => {
            console.log("Display Failed", err);
         }
      });
   }

   setForm() {
      console.log('@setForm')
      this.curriculumForm = this.fb.group({
         department: ['', Validators.required],
         version: ['', Validators.required],
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

   onEdit() {
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

   defaultSubject = {
      course: '',
      lec_units: 0,
      lab_units: 0,
      total_units: 0,
      hrs: 0,
      pre_req: '',
      co_req: ''
   };

   createSubject(subject: any) {
      return this.fb.group({
         course: [subject.course, Validators.required],
         lec_units: [subject.lec_units, [Validators.min(0), Validators.max(3), Validators.required]],
         lab_units: [subject.lab_units, [Validators.min(0), Validators.max(3), Validators.required]],
         total_units: [subject.total_units, [Validators.min(0), Validators.max(5)]],
         hrs: [subject.hrs, Validators.required],
         pre_req: subject.pre_req,
         co_req: subject.co_req,
      });
   }

   addNewSubject(subjects: FormArray) {
      let formGroup = this.createSubject(this.defaultSubject);
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

   editCurriculum(curriculumForm: FormGroup) {
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
