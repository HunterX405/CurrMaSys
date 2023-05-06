import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-subject',
  templateUrl: './view-subject.component.html',
  styleUrls: ['./view-subject.component.css']
})
export class ViewSubjectComponent implements OnInit {
  subjectID: any;
  subjectData: any;

  // For SUBJECT TYPE Display
  subjectTypes = {
    "GE": "General Education",
    "CC": "Common Courses",
    "ProfC": "Professional Courses",
    "ProfE": "Professional Electives",
    "PE": "Physical Education",
    "NSTP": "National Service Training Program"
  }

  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.subjectID = params.get('id');
      this.apiService.getSubjectInfo(this.subjectID).subscribe({
        next: (data) => {
          this.subjectData = data;
          console.log("Specific Subject Retrieved", data);
        },
        error: (err) => {
          console.log("Specific Subject Failed", err);
        }
      })
    });
  }

  goBack(){
    this.router.navigate(['/subject']);
  }
}
