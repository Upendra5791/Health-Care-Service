import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {catchError} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Credentials } from '../models/credentials.model';
import { Users } from '../models/users.model';
import { Patient } from '../models/patient';
import { Appointment } from '../models/appointment';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable()
export class ApiService {

  API_URL: String;
  AUTH_API_URL = '/auth/server/';
  // loginFailed = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.API_URL = 'api';
  }

  public checkLogin(username: string, password: string): Observable<Credentials> {
    // should return response from server
    const URL = this.API_URL + this.AUTH_API_URL;
    // handle error
    const obj = {
      username: username,
      password: password
    };
    return this.http.post<Credentials>(URL, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  public getUserDetails(userId: number): Observable<Users> {
    // should return user details retireved from server
    const URL = `${this.API_URL}/users/${userId}`;
    return this.http.get<Users>(URL);
  }

  public updateDetails(userDetails: Users): Observable<Users> {
    // should return user details if successfully updated the details

    // handle error

    const URL = `${this.API_URL}/users/${userDetails.userId}`;
    return this.http.put<Users>(URL, userDetails);
  }

  public registerPatient(patientDetails: any): Observable<any> {

    // should return response from server if patientDetails added successfully

    // handle error
    const URL = `${this.API_URL}/allpatients`;
    return this.http.post(URL, patientDetails);

  }

  public getAllPatientsList(): Observable<any> {

    // should return all patients from server

    // handle error

    const URL = `${this.API_URL}/allpatients`;
    return this.http.get(URL);
  }

  public getParticularPatient(id): Observable<any> {

    // should return particular patient details from server

    // handle error
    const URL = `${this.API_URL}/allpatients/${id}`;
    return this.http.get(URL);

  }

  public getDiseasesList(): Observable<any> {

    // should return diseases from server

    // handle error
    const URL = `${this.API_URL}/diseases`;
    return this.http.get(URL);
  }

  public bookAppointment(appointmentDetails: any): Observable<any> {

    // should return response from server if appointment booked successfully

    // handle error

    const URL = `${this.API_URL}/reqappointments`;
    return this.http.post(URL, appointmentDetails);
  }

  public requestedAppointments(): Observable<any> {

    // should return all requested appointments from server

    // handle error

    const URL = `${this.API_URL}/reqappointments`;
    return this.http.get(URL);
  }

  public getAppointments(userId): Observable<any> {

    // should return appointments of particular patient from server

    // handle error

    const URL = `${this.API_URL}/reqappointments?patientId=${userId}`;
    return this.http.get(URL);
  }

  public deleteAppointment(appointmentId): Observable<any> {

    // should delete the appointment

    // handle error

    const URL = `${this.API_URL}/reqappointments/${appointmentId}`;
    return this.http.delete(URL);
  }

  private handleError(error: Response | any) {
    console.log(error);
    return Observable.throw(error);
  }

}
