import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  redirectUrl: string | undefined;
  // To access files on the PHP folder in this project
  baseUrl: string = "http://localhost/CurrMaSys/php";
  // Will be used to store use details.


  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  // ern
  // Testing to hold the logged in user data and accessible to other components through the service.
  tempUser: any;
  currentPage: string = "";

  getPageTitle(title: string) {
    return title;
  }

  //ern

  // Registering the user
  registerUser(name: string, email: string, password: string, userType: string) {
    const newCredentials = { name, email, password, userType };

    return this.httpClient.post<any>(this.baseUrl + "/register.php", newCredentials).pipe(map(data => {
      return data;
    }));
  }

  // Logging in the user
  loginUser(email: string, password: string) {
    // The data that will be sent on the PHP file
    const credentials = { email, password };
    // 1st Param - finding the PHP file that will process the request
    // 2nd Param - the data that will be sent on the PHP file
    return this.httpClient.post<any>(this.baseUrl + "/login.php", credentials);
  }

  // Function to set the authorization header with the JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('jwt_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }

  // Function to make an authenticated API request
  getUserDetails() {
    const headers = this.getAuthHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/getUserDetails.php`, { headers });
  }

  // Getting the list of users
  displayUsers() {
    return this.httpClient.get<any>(this.baseUrl + "/displayUsers.php").pipe(
      map(data => {
        return data["data"];
      })
    );
  }

  editProfile(name: string, email: string, newPassword: string) {
    const credentials = { name, email, newPassword }
    return this.httpClient.post<any>(this.baseUrl + "/editProfile.php", credentials).pipe(map(data => {
      console.log("@ Service editProfile")
      console.log(data);
      return data;
    }));
  }

  resetPassword(email: string, newPassword: string) {
    const credentials = { email, newPassword };
    return this.httpClient.post<any>(this.baseUrl + "/forgotPassword.php", credentials).pipe(map(data => {
      console.log("@ Service")
      console.log(data);
      return data;
    }));
  }

  addSubject(courseCode: string, title: string, syllabus: string) {
    console.log("@ addSubject Service");
    // Removes the C:\fakepath\ on the value of the directory using RegEx
    syllabus = syllabus.replace(/^C:\\fakepath\\/i, '');
    const subData = { courseCode, title, syllabus };

    return this.httpClient.post<any>(this.baseUrl + "/addSubject.php", subData).pipe(map(data => {
      return data;
    }));
  }

  displaySubjects() {
    return this.httpClient.get<any>(this.baseUrl + "/displaySubjects.php").pipe(
      map(data => {
        return data["data"];
      })
    )
  }

  getSubjectInfo(subjectID: any) {
    const credentials = { subjectID };
    return this.httpClient.post<any>(this.baseUrl + "/getSubjectInfo.php", credentials).pipe(map(data => {
      console.log("@ Service getSubjectInfo")
      console.log(data);
      return data;
    }));
  }

  editSubject(subjectID: any, courseCode: string, title: string, syllabus: string, isChanged: boolean) {
    syllabus = syllabus.replace(/^C:\\fakepath\\/i, '');
    const subData = {subjectID, courseCode, title, syllabus, isChanged};
    
    return this.httpClient.post<any>(this.baseUrl + "/editSubject.php", subData).pipe(map(data => {
      return data;
    }));
  }

  checkJwtToken(): boolean {
    return this.cookieService.check('jwt_token');
  }

  isLoggedIn(): Observable<boolean> {
    if (this.checkJwtToken()) {
      return of(true);
    }
    return of(false);
  }

  setCookie(name: string, value: string) {
    // Set cookie with expiry time of 1 hour
    const expiryTime = new Date();
    expiryTime.setTime(expiryTime.getTime() + (60 * 60 * 1000)); // 1 hour
    const options = {
      expires: expiryTime,
      secure: true,
      httpOnly: true
    };

    this.cookieService.set(name, value, options);
  }

  deleteCookie(name: string) {
    this.cookieService.delete(name);
  }
}
