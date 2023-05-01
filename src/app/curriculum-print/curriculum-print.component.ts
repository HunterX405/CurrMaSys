import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-curriculum-print',
    templateUrl: './curriculum-print.component.html',
    styleUrls: ['./curriculum-print.component.css']
})
export class CurriculumPrintComponent implements OnInit, AfterViewInit {

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    curriculum: any;
    yearSem: any;
    firstYearFirstSem: any;
    firstYearSecondSem: any;
    secondYearFirstSem: any;
    secondYearSecondSem: any;
    thirdYearFirstSem: any;
    thirdYearSecondSem: any;
    fourthYearFirstSem: any;
    fourthYearSecondSem: any;
    electives: any;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {

            // Get curriculum details
            this.printCurriculum(Number(params.get('id')), Number(params.get('ver')), String(params.get('year')), String(params.get('semester')));

            // Go back to the curriculum page after printing.
            window.onafterprint = (event) => {
                this.router.navigate(['curriculum/' + params.get('id') + '/' + params.get('ver')]);
            };
        });
    }

    ngAfterViewInit(): void {
        window.setTimeout(() => {
            window.print();
          }, 2000);
    }

    getElectives(electives: string) {
        return electives.split(",");
    }

    printCurriculum(currId: number, currVer: number, year: any, semester: any) {
        this.apiService.getCurriculum(currId, currVer).subscribe({
            next: (data) => {
                this.curriculum = data.curriculum;
                console.log("Get Curriculum Success", data);
                this.firstYearFirstSem = data.subjects.filter(subject => subject.year === 1 && subject.semester === 1);
                this.firstYearSecondSem = data.subjects.filter(subject => subject.year === 1 && subject.semester === 2);
                this.secondYearFirstSem = data.subjects.filter(subject => subject.year === 2 && subject.semester === 1);
                this.secondYearSecondSem = data.subjects.filter(subject => subject.year === 2 && subject.semester === 2);
                this.thirdYearFirstSem = data.subjects.filter(subject => subject.year === 3 && subject.semester === 1);
                this.thirdYearSecondSem = data.subjects.filter(subject => subject.year === 3 && subject.semester === 2);
                this.fourthYearFirstSem = data.subjects.filter(subject => subject.year === 4 && subject.semester === 1);
                this.fourthYearSecondSem = data.subjects.filter(subject => subject.year === 4 && subject.semester === 2);
                this.electives = data.subjects.filter(subject => subject.electives_track);

                if (year === '1') {
                    this.yearSem = [
                        { 'yearTitle': 'FIRST', 'sem1': this.firstYearFirstSem, 'sem2': this.firstYearSecondSem }
                    ];
                }
                else if (year === '2') {
                    this.yearSem = [
                        { 'yearTitle': 'SECOND', 'sem1': this.secondYearFirstSem, 'sem2': this.secondYearSecondSem }
                    ]
                }
                else if (year === '3') {
                    this.yearSem = [
                        { 'yearTitle': 'THIRD', 'sem1': this.thirdYearFirstSem, 'sem2': this.thirdYearSecondSem, }
                    ]
                }
                else if (year === '4') {
                    this.yearSem = [
                        { 'yearTitle': 'FOURTH', 'sem1': this.fourthYearFirstSem, 'sem2': this.fourthYearSecondSem, }
                    ]
                }
                else if (year === 'all') {
                    this.yearSem = [
                        { 'yearTitle': 'FIRST', 'sem1': this.firstYearFirstSem, 'sem2': this.firstYearSecondSem },
                        { 'yearTitle': 'SECOND', 'sem1': this.secondYearFirstSem, 'sem2': this.secondYearSecondSem },
                        { 'yearTitle': 'THIRD', 'sem1': this.thirdYearFirstSem, 'sem2': this.thirdYearSecondSem },
                        { 'yearTitle': 'FOURTH', 'sem1': this.fourthYearFirstSem, 'sem2': this.fourthYearSecondSem },
                    ];
                }
                else {
                    this.yearSem = [
                        { 'yearTitle': 'FIRST', 'sem1': this.firstYearFirstSem, 'sem2': this.firstYearSecondSem },
                        { 'yearTitle': 'SECOND', 'sem1': this.secondYearFirstSem, 'sem2': this.secondYearSecondSem },
                        { 'yearTitle': 'THIRD', 'sem1': this.thirdYearFirstSem, 'sem2': this.thirdYearSecondSem },
                        { 'yearTitle': 'FOURTH', 'sem1': this.fourthYearFirstSem, 'sem2': this.fourthYearSecondSem },
                    ];
                }

                if (year === '1' && semester === '1') {
                    this.yearSem = [
                        { 'yearTitle': 'FIRST', 'sem1': this.firstYearFirstSem, 'sem2': [] }
                    ];
                }
                if (year === '1' && semester === '2') {
                    this.yearSem = [
                        { 'yearTitle': 'FIRST', 'sem1': [], 'sem2': this.firstYearSecondSem }
                    ];
                }
                if (year === '2' && semester === '1') {
                    this.yearSem = [
                        { 'yearTitle': 'SECOND', 'sem1': this.secondYearFirstSem, 'sem2': [] },
                    ];
                }
                if (year === '2' && semester === '2') {
                    this.yearSem = [
                        { 'yearTitle': 'SECOND', 'sem1': [], 'sem2': this.secondYearSecondSem },
                    ];
                }
                if (year === '3' && semester === '1') {
                    this.yearSem = [
                        { 'yearTitle': 'THIRD', 'sem1': this.thirdYearFirstSem, 'sem2': [] },
                    ];
                }
                if (year === '3' && semester === '2') {
                    this.yearSem = [
                        { 'yearTitle': 'THIRD', 'sem1': [], 'sem2': this.thirdYearSecondSem, },
                    ];
                }
                if (year === '4' && semester === '1') {
                    this.yearSem = [
                        { 'yearTitle': 'FOURTH', 'sem1': this.fourthYearFirstSem, 'sem2': [] },
                    ];
                }
                if (year === '4' && semester === '2') {
                    this.yearSem = [
                        { 'yearTitle': 'FOURTH', 'sem1': [], 'sem2': this.fourthYearSecondSem },
                    ];
                }
                if (year === 'all' && semester === '1') {
                    this.yearSem = [
                        { 'yearTitle': 'FIRST', 'sem1': this.firstYearFirstSem, 'sem2': [] },
                        { 'yearTitle': 'SECOND', 'sem1': this.secondYearFirstSem, 'sem2': [] },
                        { 'yearTitle': 'THIRD', 'sem1': this.thirdYearFirstSem, 'sem2': [] },
                        { 'yearTitle': 'FOURTH', 'sem1': this.fourthYearFirstSem, 'sem2': [] },
                    ];
                }
                if (year === 'all' && semester === '2') {
                    this.yearSem = [
                        { 'yearTitle': 'FIRST', 'sem1': [], 'sem2': this.firstYearSecondSem },
                        { 'yearTitle': 'SECOND', 'sem1': [], 'sem2': this.secondYearSecondSem },
                        { 'yearTitle': 'THIRD', 'sem1': [], 'sem2': this.thirdYearSecondSem },
                        { 'yearTitle': 'FOURTH', 'sem1': [], 'sem2': this.fourthYearSecondSem },
                    ];
                }

            },
            error: (err) => {
                console.log("Display Failed", err);
            }
        });
    }
}
