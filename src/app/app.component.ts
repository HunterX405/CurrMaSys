import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CurrMaSys';
  
  ngOnInit(): void {
    this.detectColorScheme();
  }

  detectColorScheme(){
    if(localStorage.getItem('data-theme')==='dark'){
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    else{
      document.documentElement.setAttribute('data-theme', 'light');
    }

  }

}
