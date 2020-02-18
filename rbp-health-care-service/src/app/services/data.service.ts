
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Users } from '../models/users.model';
import { Patient } from '../models/patient';
import { Appointment } from '../models/appointment';
import { map, catchError } from "rxjs/operators";
import { ApiService } from './api.service';

@Injectable()
export class DataService {

  isLoggedIn = false;
  isLogIn: BehaviorSubject<boolean>;
  constructor(private api: ApiService) {
    this.isLogIn = new BehaviorSubject<boolean>(false);
  }

  authenticateUser(username: string, password: string): Observable<boolean> {
      return this.api.checkLogin(username, password)
        .pipe(
        catchError(err=>{
          return Observable.throw(err); 
        })
      ).pipe(
        map(res => {
          if (res && res.userId) {
          localStorage.setItem('userId', String(res.userId));
          this.isLoggedIn = true;
          this.isLogIn.next(true);
          return true;
          } else {
          return false;
          }
        }
      ))
  }
  getAuthStatus(): Observable<boolean> {

    return of(this.isLoggedIn);
  }
  doLogOut() {
    // remove the key 'userId' if exists
    localStorage.removeItem('userId');
    this.isLoggedIn = false;
    this.isLogIn.next(false);
  }

  getUserDetails(userId: number): Observable<Users> {

    // should return user details retrieved from api service
    return this.api.getUserDetails(userId);

  }

  updateProfile(userDetails): Observable<boolean> {

    // should return the updated status according to the response from api service

    return this.api.updateDetails(userDetails)
      .pipe(
        map(res => {
          if (res) {
            return true;
          } else {
            return false;
          }
        })
      ).pipe(
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }

  registerPatient(patientDetails): Observable<any> {


    // should return response retrieved from ApiService

    // handle error

    return this.api.registerPatient(patientDetails);

  }

  getAllPatientsList(): Observable<any> {


    // should return all patients list retrieved from ApiService

    // handle error

    return this.api.getAllPatientsList();

  }

  getParticularPatient(id): Observable<any> {

    // should return particular patient details retrieved from ApiService
    return this.api.getParticularPatient(id);

    // handle error

  }

  getDiseasesList(): Observable<any> {

    // should return response retrieved from ApiService

    // handle error

    return this.api.getDiseasesList();;
  }

  bookAppointment(appointmentDetails): Observable<any> {

    // should return response retrieved from ApiService

    // handle error

    return this.api.bookAppointment(appointmentDetails);
  }

  getAppointments(patientId): Observable<any> {

    // should return response retrieved from ApiService

    // handle error

    return this.api.getAppointments(patientId);
  }

  deleteAppointment(appointmentId): Observable<any> {

    // should return response retrieved from ApiService

    // handle error

    return this.api.deleteAppointment(appointmentId);
  }

  requestedAppointments(): Observable<any> {

    // should return response retrieved from ApiService

    // handle error

    return this.api.requestedAppointments();
  }

  getUserId(): number {

    // retrieve 'userId' from localstorage
    const userId =  localStorage.getItem('userId');
    if (this.isLogIn.value && userId) {
      return Number(userId);
    } else {
      return -1;
    }
    
  }


}

