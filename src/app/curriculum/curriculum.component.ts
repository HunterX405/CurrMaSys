import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import * as $ from 'jquery';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';

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

    isSubmitted: boolean = false;
    isTableVisible: boolean = true;
    curriculums: any;
    subjectsList: any;
    curriculumForm!: FormGroup;
    subjectsArray: any;
    isFormSet: boolean = false;
    buttons: any = [];
    columns: any = [];
    tempUserType: string = "";
    activeSubcategory = 'All';

    ngOnInit(): void {
        this.apiService.getUserDetails().subscribe(response => {
            if (response.userType === 'admin' || response.userType === 'chair') {
                this.buttons = [
                    {
                        extend: 'csv',
                        text: 'CSV',
                        className: 'btn btn-primary',
                        exportOptions: {
                            columns: ':visible:not(:nth-child(4))'
                        }
                    },
                    {
                        extend: 'print',
                        text: 'PDF',
                        className: 'btn btn-primary',
                        exportOptions: {
                            columns: ':visible:not(:nth-child(4))'
                        }
                    },
                ];
            }
            this.tempUserType = response.userType;
        });

        this.displayCurriculum();
    }

    displayCurriculum() {
        this.apiService.displayCurriculum().subscribe({
            next: (data) => {
                console.log("Display Successful", data);
                this.curriculums = data;

                this.setDataTable();
            },
            error: (err) => {
                console.log("Display Failed", err);
            }
        });
    }

    setDataTable() {
        let btn = this.buttons;
        let curr = this.curriculums;
        // jQuery $(document).ready(function({})) is deprecated, Use $(function() {} instead.
        $(function () {
            $('#curriculumsTable').DataTable({
                data: curr,
                dom: '<"row"<"top-left col-sm-6" f><"top-right d-flex justify-content-end col-sm-6"B>rt<"bottom"ip><"clear">',
                buttons: btn,
                "ordering": false,
                language: {
                    searchPlaceholder: "Find records..."
                },
                "pageLength": 10,
                columns: [
                    { data: 'id', title: 'ID' },
                    { data: 'department', title: 'Department' },
                    { data: 'version', title: 'Version Name' },
                    {
                        data: 'version_id', title: 'Version ID', render: (data, type, row) => {
                            if (row.isLatest) {
                                return `Latest(${row.version_id})`;
                            }
                            return row.version_id;
                        }
                    },
                    { data: 'date_and_time', title: 'Submission Date' },
                    {
                        data: null, title: 'Actions', render: (data, type, row) => {
                            return `
                                <a class="btn btn-primary btn-sm" *ngIf="tempUserType === 'stakeholder'"
                                    href="curriculum/${row.id}/${row.version_id}">
                                    View
                                </a>
                            `;
                        }
                    }
                ],
            });
        });
    }

    setSubCategory(subcategory: string) {
        this.activeSubcategory = subcategory;
        this.refreshTable();
    }

    refreshTable() {
        let currs = this.curriculums;
        if (this.activeSubcategory !== 'All') {
            currs = this.curriculums.filter(curriculum =>
                curriculum.isLatest == 1
            );
        }
        $('#curriculumsTable').DataTable().clear().rows.add(currs).draw();
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
                // let saw = data.map(subject => [subject.id,subject.course_code]);
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
        this.isTableVisible = false;
    }

    onGoBack() {
        this.isTableVisible = true;
        this.setDataTable();
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
        let lab = subjects.at(id).get('lab_units')?.value;
        let lec = subjects.at(id).get('lec_units')?.value;
        subjects.at(id).get('total_units')?.setValue(lab + lec);
        subjects.at(id).get('hrs')?.setValue((lab * 2) + lec);
    }

    getFormTotals(subjects: FormArray) {
        let lec: number = 0;
        let lab: number = 0;
        let all: number = 0;
        let hrs: number = 0;
        subjects.value.forEach(subject => {
            lec += subject.lec_units;
            lab += subject.lab_units;
            all += subject.total_units;
            hrs += subject.hrs;
        });
        if (all > 30) {
            subjects.setErrors({ 'invalid': true });
        } else {
            subjects.setErrors(null);
        }
        return { 'lec': lec, 'lab': lab, 'all': all, 'hrs': hrs };
    }

    totalForCurr = { "tAll": 0, "tHrs": 0 };
    selectedSubjects: number[] = [];
    getCurrTotals() {
        let tAll = 0;
        let tHrs = 0;
        let subj: number[] = [];
        this.subjectsArray.forEach(yearSem => {
            yearSem['array'].value.forEach(s => {
                subj.push(Number(s.course));
                tAll += s.total_units;
                tHrs += s.hrs;
            });
        });
        this.totalForCurr["tAll"] = tAll;
        this.totalForCurr["tHrs"] = tHrs;
        this.selectedSubjects = subj;
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
        } else {
            alert('Form has validation errors. Make sure all data is correct before submitting.');
        }
        this.isSubmitted = true;

    }
}
