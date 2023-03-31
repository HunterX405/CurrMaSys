import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  redirectUrl: string | undefined;
  // To access files on the PHP folder in this project
  baseUrl: string = "http://localhost/CurrMaSys/php";
  // Currently unused
  // @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  // Testing to hold the logged in user data and accessible to other components through the service.
  tempUser: any;

  constructor(private httpClient: HttpClient) { }

  // Loggin in the user
  loginUser(email: string, password: string) {
    // The data that will be sent on the PHP file
    const credentials = { email, password };

    // 1st Param - finding the PHP file that will process the request
    // 2nd Param - the data that will be sent on the PHP file
    // The <any> is needed for the this.setToken
    return this.httpClient.post<any>(this.baseUrl + "/login.php", credentials).pipe(map(data => {
      // data represent an object that contains all data from the DB.
      // data is an array so accessing the 1st element is used then accessing the other properties in the array.
      // Used for validating the inputted email and password
      // If setToken is not used, all input will be accepted and successful
      this.setToken(data[0].name);

      // Setting the logged in user in the tempUser
      this.tempUser = data[0];

      // Unused
      // this.getLoggedInName.emit(true);

      return data;
    })
    );
  }

  // Registering the user
  registerUser(name: string, email: string, password: string, userType: string) {
    const newCredentials = { name, email, password, userType };

    return this.httpClient.post<any>(this.baseUrl + "/register.php", newCredentials)
      .pipe(map(data => {
        return data;
      }));
  }

  // Getting the list of users
  displayUsers() {
    return this.httpClient.get<any>(this.baseUrl + "/displayUsers.php").pipe(
      map(data => {
        return data["data"];
      })
    )
  }

  // Token
  // The main purpose of tokens are still unidentified
  // Used for logging in the user
  // Notes: The localStorage is used to save data depending on the value of the token. 
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    const usertoken = this.getToken();
    if (usertoken != null) {
      return true
    }
    return false;
  }

  // ChatGPT Sample Code for Login Feature
  // private loggedIn = false;

  // login(username: string, password: string): Observable<any> {
  //   const credentials = { username, password };

  //   return this.httpClient.post('/api/login', credentials).pipe(
  //     tap((response: any) => {
  //       if (response && response.token) {
  //         localStorage.setItem('auth_token', response.token);
  //         this.loggedIn = true;
  //       }
  //     })
  //   );
  // }
  // logout() {
  //   localStorage.removeItem('auth_token');
  //   this.loggedIn = false;
  // }

  // isLoggedIn(): boolean {
  //   return this.loggedIn;
  // }
}
