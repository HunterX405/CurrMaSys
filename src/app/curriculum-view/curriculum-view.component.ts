import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';


@Component({
    selector: 'app-curriculum-view',
    templateUrl: './curriculum-view.component.html',
    styleUrls: ['./curriculum-view.component.css']
})
export class CurriculumViewComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    isTableVisible: boolean = true;
    curriculum: any;
    subjectsList: any;
    curriculumForm!: FormGroup;
    filterForm!: FormGroup;
    subjectsArray: any;
    isFormSet: boolean = false;
    isSubmitted: boolean = false;
    isPrint: boolean = false;
    yearSem: any;
    currId!: number;
    currVer!: number;
    firstYearFirstSem: any;
    firstYearSecondSem: any;
    secondYearFirstSem: any;
    secondYearSecondSem: any;
    thirdYearFirstSem: any;
    thirdYearSecondSem: any;
    fourthYearFirstSem: any;
    fourthYearSecondSem: any;
    apiUrl: string = environment.apiUrl;
    electives: any;
    formElectives: any;
    paramyear: string = 'all';
    paramsem: string = 'all';
    userType: any;

    ngOnInit(): void {
        // Getting the ID of the Curriculum
        this.apiService.getUserDetails().subscribe(response => {
            this.userType = response.userType;
        });

        this.filterForm = this.fb.group({
            year: ['all'],
            semester: ['all']
        });

        this.route.paramMap.subscribe(params => {
            this.currId = Number(params.get('id'));
            this.currVer = Number(params.get('ver'));
            this.displayCurriculum(this.currId, this.currVer);
        });

        this.curriculumForm = this.fb.group({
            currId: this.currId,
            verId: this.currVer,
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

        window.onafterprint = (event) => {
            this.isPrint = false;
        };
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

    displayCurriculum(currId: number, currVer: number) {
        this.apiService.getCurriculum(currId, currVer).subscribe({
            next: (data) => {
                console.log("GET Curriculum", data);
                this.curriculum = data.curriculum;
                this.firstYearFirstSem = data.subjects.filter(subject => subject.year === 1 && subject.semester === 1);
                this.firstYearSecondSem = data.subjects.filter(subject => subject.year === 1 && subject.semester === 2);
                this.secondYearFirstSem = data.subjects.filter(subject => subject.year === 2 && subject.semester === 1);
                this.secondYearSecondSem = data.subjects.filter(subject => subject.year === 2 && subject.semester === 2);
                this.thirdYearFirstSem = data.subjects.filter(subject => subject.year === 3 && subject.semester === 1);
                this.thirdYearSecondSem = data.subjects.filter(subject => subject.year === 3 && subject.semester === 2);
                this.fourthYearFirstSem = data.subjects.filter(subject => subject.year === 4 && subject.semester === 1);
                this.fourthYearSecondSem = data.subjects.filter(subject => subject.year === 4 && subject.semester === 2);
                this.electives = data.subjects.filter(subject => subject.electives_track);
                this.yearSem = [
                    { 'yearTitle': 'FIRST', 'year': 1, 'sem1': this.firstYearFirstSem, 'sem1Array': this.firstYearFirstSemArray, 'sem2': this.firstYearSecondSem, 'sem2Array': this.firstYearSecondSemArray },
                    { 'yearTitle': 'SECOND', 'year': 2, 'sem1': this.secondYearFirstSem, 'sem1Array': this.secondYearFirstSemArray, 'sem2': this.secondYearSecondSem, 'sem2Array': this.secondYearSecondSemArray },
                    { 'yearTitle': 'THIRD', 'year': 3, 'sem1': this.thirdYearFirstSem, 'sem1Array': this.thirdYearFirstSemArray, 'sem2': this.thirdYearSecondSem, 'sem2Array': this.thirdYearSecondSemArray },
                    { 'yearTitle': 'FOURTH', 'year': 4, 'sem1': this.fourthYearFirstSem, 'sem1Array': this.fourthYearFirstSemArray, 'sem2': this.fourthYearSecondSem, 'sem2Array': this.fourthYearSecondSemArray, },
                ];
                this.getCurrTotals();
            },
            error: (err) => {
                console.log("Display Failed", err);
            }
        });
    }

    filterTable() {
        const year = this.filterForm.value.year;
        const semester = this.filterForm.value.semester;
        this.paramyear = year;
        this.paramsem = semester;
    }

    setForm() {
        console.log('@setForm');

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
                console.log("GET Subjects", data);
                this.subjectsList = data;
                this.formElectives = this.electives;
            },
            error: (err) => {
                console.log("Get Subjects Failed");
                console.log(err);
            }
        });

        this.yearSem = [
            { 'yearTitle': 'FIRST', 'sem1': this.firstYearFirstSem, 'sem1Array': this.firstYearFirstSemArray, 'sem2': this.firstYearSecondSem, 'sem2Array': this.firstYearSecondSemArray },
            { 'yearTitle': 'SECOND', 'sem1': this.secondYearFirstSem, 'sem1Array': this.secondYearFirstSemArray, 'sem2': this.secondYearSecondSem, 'sem2Array': this.secondYearSecondSemArray },
            { 'yearTitle': 'THIRD', 'sem1': this.thirdYearFirstSem, 'sem1Array': this.thirdYearFirstSemArray, 'sem2': this.thirdYearSecondSem, 'sem2Array': this.thirdYearSecondSemArray },
            { 'yearTitle': 'FOURTH', 'sem1': this.fourthYearFirstSem, 'sem1Array': this.fourthYearFirstSemArray, 'sem2': this.fourthYearSecondSem, 'sem2Array': this.fourthYearSecondSemArray, },
        ];

        // Set form values
        this.curriculumForm.get('department')?.setValue(this.curriculum.department);
        this.curriculumForm.get('version')?.setValue(this.curriculum.version);

        this.yearSem.forEach(year => {
            year['sem1'].forEach(sem => {
                this.addExistingSubject(year['sem1Array'], sem);
            });
            year['sem2'].forEach(sem => {
                this.addExistingSubject(year['sem2Array'], sem);
            });
        });

        this.getCurrTotals();
    }

    onEdit() {
        if (!this.isFormSet) {
            this.setForm();
            this.isFormSet = true;
        }
        this.isTableVisible = !this.isTableVisible;
        console.log('table', this.isTableVisible);
    }

    onGoBack1() {
        this.router.navigate(['/curriculum']);
    }

    onGoBack() {
        this.isTableVisible = !this.isTableVisible;
    }

    defaultSubject = {
        id: '',
        lec_units: 0,
        lab_units: 0,
        total_units: 0,
        hrs: 0,
        pre_requisite_id: '',
        co_requisite_id: ''
    };

    createSubject(subject: any) {
        let subjectFormGroup = this.fb.group({
            course: [subject.id, Validators.required],
            lec_units: [Number(subject.lec_units), [Validators.min(0), Validators.max(3), Validators.required]],
            lab_units: [Number(subject.lab_units), [Validators.min(0), Validators.max(3), Validators.required]],
            total_units: [Number(subject.total_units), [Validators.min(0), Validators.max(5)]],
            hrs: [subject.hrs, Validators.required],
            pre_req: subject.pre_requisite_id ? [subject.pre_requisite_id.split(",").map(Number)] : '',
            co_req: subject.co_requisite_id ? subject.co_requisite_id : ''
        });

        return subjectFormGroup;
    }

    addNewSubject(subjects: FormArray) {
        let formGroup = this.createSubject(this.defaultSubject);
        subjects.push(formGroup);
    }

    addExistingSubject(subjects: FormArray, subject: any) {
        let formGroup = this.createSubject(subject);
        subjects.push(formGroup);
    }

    deleteSubject(i: number, subjects: FormArray) {
        subjects.removeAt(i);
    }

    getTotalUnits(id: number, subjects: FormArray) {
        let lab: number = subjects.at(id).get('lab_units')?.value;
        let lec: number = subjects.at(id).get('lec_units')?.value;
        subjects.at(id).get('total_units')?.setValue(lec + lab);
        subjects.at(id).get('hrs')?.setValue((lab * 2) + lec);
    }

    getTotals(subjects: any) {
        let lec: number = 0;
        let lab: number = 0;
        let all: number = 0;
        let hrs: number = 0;
        subjects.forEach(subject => {
            lec += Number(subject.lec_units);
            lab += Number(subject.lab_units);
            all += Number(subject.total_units);
            hrs += Number(subject.hrs);
        });
        return { 'lec': lec, 'lab': lab, 'all': all, 'hrs': hrs };
    }

    getFormTotals(subjects: FormArray) {
        let lec: number = 0;
        let lab: number = 0;
        let all: number = 0;
        let hrs: number = 0;
        subjects.value.forEach(subject => {
            lec += Number(subject.lec_units);
            lab += Number(subject.lab_units);
            all += Number(subject.total_units);
            hrs += Number(subject.hrs);
        });
        if (all > 30) {
            subjects.setErrors({ 'invalid': true });
        } else {
            subjects.setErrors(null);
        }
        return { 'lec': lec, 'lab': lab, 'all': all, 'hrs': hrs };
    }

    getElectives(electives: string) {
        return electives.split(",");
    }

    checkElective(subject: any) {
        console.log(this.subjectsList);
        console.log('subject', this.subjectsList.filter(ss => {
            ss.course_code == 'IT 204';
        }));
    }

    totalForCurr = { "tAll": 0, "tHrs": 0 };
    selectedSubjects: number[] = [];
    getCurrTotals() {
        let tAll = 0;
        let tHrs = 0;
        let subj: number[] = [];
        this.yearSem.forEach(ys => {
            if (this.isTableVisible) {
                ys['sem1'].forEach(s => {
                    subj.push(Number(s.id));
                    tAll += Number(s.total_units);
                    tHrs += Number(s.hrs);
                });
                ys['sem2'].forEach(s => {
                    subj.push(Number(s.id));
                    tAll += Number(s.total_units);
                    tHrs += Number(s.hrs);
                });
            } else {
                ys['sem1Array'].value.forEach(s => {
                    subj.push(Number(s.course));
                    tAll += s.total_units;
                    tHrs += s.hrs;
                });
                ys['sem2Array'].value.forEach(s => {
                    subj.push(Number(s.course));
                    tAll += s.total_units;
                    tHrs += s.hrs;
                });
            }

        });
        this.totalForCurr["tAll"] = tAll;
        this.totalForCurr["tHrs"] = tHrs;
        this.selectedSubjects = subj;
    }

    editCurriculum(curriculumForm: FormGroup) {
        console.log("@ addCurriculum");

        if (curriculumForm.valid) {
            this.apiService.editCurriculum(JSON.stringify(curriculumForm.value)).subscribe({
                next: (data) => {
                    console.log("Curriculum Edited Successfully", data);
                    alert("Curriculum edited successfully.");
                    // The parameter is the generated number from the addSubject.php
                    this.router.navigate(['curriculum/' + data.curr_id + '/' + data.curr_version]);
                    this.isTableVisible = true;
                },
                error: (err) => {
                    console.log("Curriculum Editing Failed", err);
                }
            });
        } else {
            alert('Form has validation errors. Make sure all data is correct before submitting.');
        }
        this.isSubmitted = true;
    }

    printCurriculum() {
        this.isPrint = true;
        setTimeout(() => {
            window.print();
        }, 1000);
    }
}
