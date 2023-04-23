import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

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
      },
      error: (err) => {
        console.log("Display Failed", err);
      }
    });
  }
}
