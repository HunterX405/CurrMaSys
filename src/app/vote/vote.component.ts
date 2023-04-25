import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import * as $ from 'jquery';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit{
  curriculums: any;
  
  tempUserType: any;

  isTableVisible: boolean = true;
  isTableSubmittedVisible: boolean = true;



  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.displayCurriculum();

    this.apiService.getUserDetails().subscribe(response => {
      this.tempUserType = response.userType;
    });
  }

  // Display the list of Curriculum for Stakeholders
  displayCurriculum() {
    this.apiService.displayCurriculum().subscribe({
      next: (data) => {
        console.log("Display Successful");
        this.curriculums = data;
        setTimeout(() => {
          // jQuery $(document).ready(function({})) is deprecated, Use $(function() {} instead.
          $(function() {
            $('#voteTable').DataTable( {
              dom: '<"row"<"top-left col-sm-6" f><"top-right d-flex justify-content-end col-sm-6"B>rt<"bottom"ip><"clear">',
              
              buttons: [
                {
                  extend: 'csv',
                  text: 'CSV',
                  className: 'btn btn-primary',
                  exportOptions: {
                    columns: ':visible:not(:nth-child(5))'
                  }
                },
                {
                  extend: 'print',
                  text: 'PDF',
                  className: 'btn btn-primary',
                  exportOptions: {
                    columns: ':visible:not(:nth-child(5))'
                  }
                },
              ],
              "ordering": false,
              language: {
                searchPlaceholder: "Find records..."
              },
              "pageLength": 10,

            });
          });
        }, 0);
      },
      error: (err) => {
        console.log("Display Failed", err);
      }
    });
  }
}
