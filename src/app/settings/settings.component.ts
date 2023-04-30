import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})



export class SettingsComponent {

  darkMode = false;

  constructor(){
    this.detectColorScheme();
  }

  detectColorScheme(){
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
      this.darkMode = true;
      document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
    }
  }

  toggleTheme(){
    this.darkMode = !this.darkMode;
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
    localStorage.setItem('data-theme', this.darkMode ? 'dark' : 'light');
  }


}
