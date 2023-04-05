import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  redirectUrl: string | undefined;
  // To access files on the PHP folder in this project
  baseUrl: string = "http://localhost/CurrMaSys/php";

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  getUser(id: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl+"/disableUser.php"}?id=${id}`;
    return this.httpClient.get<any>(url,{headers});
  }

  activationUser(id:any, formvalues:any) {
    return this.httpClient.post(this.baseUrl+'/disableUser.php', formvalues);
  }

  getPageTitle(title: string) {
    return title;
  }

  // Registering the user
  registerUser(name: string, email: string, userType: string) {
    const newCredentials = { name, email, userType };

    return this.httpClient.post<any>(this.baseUrl + "/register.php", newCredentials).pipe(map(data => {
      console.log(data);
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

  getUserDetails() {
    const headers = this.getAuthHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/getUserDetails.php`, { headers });
  }

  // Getting the list of users
  displayUsers() {
    return this.httpClient.get<any>(this.baseUrl + "/displayUsers.php").pipe(
      map(data => {
        return data['users'];
      })
    );
  }

  editProfile(id: string, name: string, email: string, newPassword: string) {
    const credentials = { id, name, email, newPassword }
    return this.httpClient.post<any>(this.baseUrl + "/editProfile.php", credentials).pipe(map(data => {
      console.log("@ Service editProfile")
      console.log(data);
      return data;
    }));
  }

  resetPassword(email: string, newPassword: string) {
    const credentials = { email, newPassword };
    return this.httpClient.post<any>(this.baseUrl + "/forgotPassword.php", credentials).pipe(map(data => {
      console.log("@apiService/resetPassword")
      return data;
    }));
  }

  addSubject(course_code: string, title: string, syllabus: string) {
    console.log("@ addSubject Service");
    // Removes the C:\fakepath\ on the value of the directory using RegEx
    syllabus = syllabus.replace(/^C:\\fakepath\\/i, '');
    
    const subData = { course_code, title, syllabus };

    return this.httpClient.post<any>(this.baseUrl + "/addSubject.php", subData).pipe(map(data => {
      return data;
    }));
  }

  displaySubjects() {
    return this.httpClient.get<any>(this.baseUrl + "/displaySubjects.php").pipe(
      map(data => {
        return data["subjects"];
      })
    )
  }

  getSubjectInfo(subjectID: any) {
    const credentials = { subjectID };
    return this.httpClient.post<any>(this.baseUrl + "/getSubjectInfo.php", credentials).pipe(map(data => {
      console.log("@ Service getSubjectInfo");
      return data[0];
    }));
  }

  editSubject(subjectID: any, course_code: string, title: string, syllabus: string) {
    syllabus = syllabus.replace(/^C:\\fakepath\\/i, '');
    const subData = {subjectID, course_code, title, syllabus};
    return this.httpClient.post<any>(this.baseUrl + "/editSubject.php", subData).pipe(map(data => {
      return data;
    }));
  }

  uploadFile(file: Blob, fileName: string, oldFileName: string = '') {
    const formData = new FormData();
    formData.append("file", file, fileName);
    if (oldFileName !== '') {
      formData.append("oldFileName", oldFileName);
    }
    this.httpClient.post<any>("http://localhost/CurrMaSys/php/uploadFile.php", formData).subscribe({
      next: (data) => {
        console.log("Upload File Successful", data);
      },
      error: (err) => {
        console.log("Upload File Failed", err);
      }
    });
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
