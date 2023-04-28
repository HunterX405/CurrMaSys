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

   ngOnInit(): void {
      this.route.paramMap.subscribe(params => {

         // Get curriculum details
         this.printCurriculum(Number(params.get('id')), Number(params.get('ver')));

         // Go back to the curriculum page after printing.
         window.onafterprint = (event) => {
            this.router.navigate(['curriculum/' + params.get('id') + '/' + params.get('ver')]);
         };
      });
   }

   ngAfterViewInit() {
      window.print();
   }

   printCurriculum(currId: number, currVer: number) {
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
}
