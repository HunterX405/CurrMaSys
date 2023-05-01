import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from './../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    redirectUrl: string | undefined;
    // To access files on the PHP folder in this project
    baseUrl: string = environment.apiUrl;

    private sendGridAPIKey = 'wala pa haha ayaw gumana pa eh haha yung sa apikey';

    constructor(
        private httpClient: HttpClient,
        private cookieService: CookieService
    ) { }

    sendEmail(to: string, subject: string, message: string) {
        const emailData = {
            personalizations: [
                {
                    to: [
                        { email: to }
                    ],
                    subject: subject
                }
            ],
            from: {
                email: 'CurrMaSys@gmail.com',
                name: 'CurrMaSys'
            },
            content: [
                {
                    type: 'text/plain',
                    value: message
                }
            ]
        };

        return this.httpClient.post(`https://api.sendgrid.com/v3/mail/send`, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.sendGridAPIKey}`
            }
        });
    }

    count() {
        return this.httpClient.get<any>(this.baseUrl + "/count.php");
    }

    countUser() {
        return this.httpClient.get<any>(this.baseUrl + "/countUsers.php");
    }

    countCurrStatus() {
        return this.httpClient.get<any>(this.baseUrl + "/countCurrstatus.php");
    }

    getUser(id: any): Observable<any> {
        const url = `${this.baseUrl + "/disableUser.php"}?id=${id}`;
        return this.httpClient.get<any>(url);
    }

    activationUser(formvalues: any) {
        return this.httpClient.post(this.baseUrl + '/disableUser.php', formvalues);
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

    isLoggedIn(): Observable<boolean> {
        console.log(this.cookieService.check('email'));
        if (this.cookieService.check('email')) {
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

    // Function to set the authorization header with the JWT token
    // private getAuthHeaders(): HttpHeaders {
    //    const token = this.cookieService.get('jwt_token');
    //    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    //    return headers;
    // }

    getUserDetails() {
        const email = this.cookieService.get('email');
        const name = this.cookieService.get('name');
        const userType = this.cookieService.get('userType');
        const id = this.cookieService.get('id');
        //   return this.httpClient.get<any>(`${this.baseUrl}/getUserDetails.php?email=${email}`);
        return of({ 'name': name, 'email': email, 'userType': userType, 'id': id });
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

    resetPassword(email: string) {
        const credentials = { email };
        return this.httpClient.post<any>(this.baseUrl + "/forgotPassword.php", credentials).pipe(map(data => {
            console.log("@apiService/resetPassword")
            return data;
        }));
    }

    // SUBJECTS
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
        const subData = { subjectID, course_code, title, syllabus };
        return this.httpClient.post<any>(this.baseUrl + "/editSubject.php", subData).pipe(map(data => {
            return data;
        }));
    }

    // ELECTIVES
    addElectives(fkSubjID: any, el1Data: any, el2Data: any, el3Data: any) {
        // Send Objects on the addElective.php
        const elData = { fkSubjID, el1Data, el2Data, el3Data };

        return this.httpClient.post<any>(`${this.baseUrl}/addElective.php`, elData).pipe(map(data => {
            return data;
        }));
    }

    // Gets all data from the ELECTIVE table
    displayElectives() {
        return this.httpClient.get<any>(this.baseUrl + "/displayElectives.php").pipe(
            map(data => {
                return data["electives"];
            })
        )
    }

    // Gets spefic data for an elective subject from ELECTIVE table
    getElectiveInfo(electiveID: any) {
        const credentials = { electiveID };
        return this.httpClient.post<any>(this.baseUrl + "/getElectiveInfo.php", credentials).pipe(map(data => {
            console.log("@ Service getElectiveInfo");
            return data[0];
        }));
    }

    // Updates an spefic data on the ELECTIVE table
    editElective(electiveID: any, title: string, syllabus: string) {
        syllabus = syllabus.replace(/^C:\\fakepath\\/i, '');
        const subData = { electiveID, title, syllabus };
        return this.httpClient.post<any>(this.baseUrl + "/editElective.php", subData).pipe(map(data => {
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

    // CURRICULUM
    // Accesses the CURRICULUM Table
    displayCurriculum() {
        return this.httpClient.get<any>(this.baseUrl + "/displayCurriculum.php").pipe(
            map(data => {
                return data["curriculums"];
            })
        )
    }

    // Add Feedback on the VOTE Table
    addFeedback(formData: string) {
        return this.httpClient.post<any>(`${this.baseUrl}/addFeedback.php`, formData).pipe(map(data => {
            return data;
        }));
    }

    // Get the number of STAKEHOLDER ACCOUNTS
    getStakeholderNum() {
        return this.httpClient.get<any>(this.baseUrl + "/getStakeholderNum.php").pipe(
            map(data => {
                return data["stakeholders"];
            })
        )
    }

    // Get the feedbacks of a specific CURRICULUM
    getFeedbacks(currID: number, currVer: number) {
        const credentials = { currID, currVer };

        return this.httpClient.post<any>(this.baseUrl + "/getFeedbacks.php", credentials).pipe(map(data => {
            return data;
        }));
    }

    getUserFeedback(currID: number, currVer: number, userId: number) {
        const credentials = { currID, currVer, userId };

        return this.httpClient.post<any>(this.baseUrl + "/getUserFeedback.php", credentials).pipe(map(data => {
            return data;
        }));
    }

    getAllFeedbacks(id: number) {
        return this.httpClient.get<any>(`${this.baseUrl}/getAllFeedbacks.php?u=${id}`).pipe(map(data => {
            return data;
        }));
    }

    getCurriculumInfo(currID: number, currVer: number) {
        const credentials = { currID, currVer };
        return this.httpClient.post<any>(this.baseUrl + "/getCurriculumInfo.php", credentials).pipe(map(data => {
            return data;
        }));
    }

    // Determine the status of the specific CURRICULUM
    // Pending - No. of Stakeholder Accounts !== Submitted Feedback
    // Approved - All submitted feedback with is_approved has a value of 1
    // Returned - Once a submitted feeback with is_approved has a value of 0
    getCurriculumStatus(curriculumData: any, keys: any, sNum: number, fNum: number) {
        // Condition for stakeholderNum and feedbackNum
        if (sNum !== fNum) {
            return "pending";
        } else {
            // To iterate the array of the submitted feedback
            for (let i = 0; i < curriculumData.length; i++) {
                // To iterate the keys of the curriculumData Object
                for (let j = 0; j < keys.length; j++) {
                    const key = keys[j];

                    if (key === "is_approved") {
                        // To check if the current feedback with an key of "is_approved" has a value of 0
                        if (curriculumData[i][key] == 0) {
                            return "returned";
                        }
                    }
                }
            }
            // If the 1st For Loop did not return anything, the staus will be APPROVED
            return "approved";
        }
    }

    updateStatus(currID: any, currVer: any, currStatus: any) {
        const currData = { currID, currVer, currStatus };

        return this.httpClient.post<any>(this.baseUrl + "/updateStatus.php", currData).pipe(map(data => {
            return data;
        }));
    }

    // CURRICULUM

    addCurriculum(formData: string) {
        console.log("@ addCurriculum Service");

        return this.httpClient.post<any>(this.baseUrl + "/addCurriculum.php", formData).pipe(map(data => {
            return data;
        }));
    }

    getCurriculum(currId: number, currVer: number) {
        const data = { currId, currVer };

        return this.httpClient.post<any>(this.baseUrl + "/getCurriculum.php", data).pipe(map(data => {
            return data;
        }));
    }

    editCurriculum(formData: string) {
        console.log("@ addCurriculum Service");

        return this.httpClient.post<any>(this.baseUrl + "/editCurriculum.php", formData).pipe(map(data => {
            return data;
        }));
    }

    getApprovedCurr() {
        return this.httpClient.get<any>(this.baseUrl + "/getApprovedCurr.php").pipe(map(data => {
            return data["curriculum"];
        }));
    }
}
