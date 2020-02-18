import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
//import {ActivatedRoute} from '@angular/router';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { DatePipe } from '@angular/common';
import { Appointment } from '../../models/appointment';
import * as alertify from 'alertify.js';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css'],
  providers: [DatePipe]
})
export class ViewPatientComponent implements OnInit {

  patient;
  names;
  today;
  isBookAppointment: boolean = false;
  isFormEnabled: boolean = false;
  isScheduledAppointment: boolean = false;
  isTableEnabled: boolean = false;
  appointmentForm: FormGroup;
  appointmentDetails = new Appointment;
  bookedAppointmentResponse;
  ScheduledAppointmentResponse;
  diseaseList;

  constructor(fb: FormBuilder,private route: Router, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private dataService: DataService) {
    this.today = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

    // add necessary validators
    this.appointmentForm = fb.group({
      'selectDisease' : [''],
      'tentativeDate' : [''],
      'priority' : ['']
    });

   }

  ngOnInit() {

    // get selected patient id
    // get Particular Patient from service using patient id and assign response to patient property
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.dataService.getParticularPatient(params.get('id'))
        .subscribe(res => {
          this.patient = res;
        });
    });
  }

  bookAppointment() {
    // get diseases list from service
    this.dataService.getDiseasesList()
      .subscribe(res => {
        this.diseaseList = res;
      });

    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately


    this.isBookAppointment = true;
    this.isScheduledAppointment = false;
  }

  scheduleAppointment() {

    // The below attributes to be added while booking appointment using service
    // patientId, patientFirstName, patientLastName, disease, priority, tentativedate, registeredTime

    // if booked successfully should redirect to 'requested_appointments' page

    this.appointmentDetails.patientId = this.patient.id;
    this.appointmentDetails.patientFirstName = this.patient.firstName;
    this.appointmentDetails.patientLastName = this.patient.lastName;
    this.appointmentDetails.disease = this.appointmentForm.value.selectDisease;
    this.appointmentDetails.priority = this.appointmentForm.value.priority;
    this.appointmentDetails.tentativedate = this.appointmentForm.value.tentativeDate;
    this.appointmentDetails.registeredTime = this.patient.registeredTime;

    this.dataService.bookAppointment(this.appointmentDetails)
      .subscribe(res => {
        if (res) {
          this.route.navigate(['/requested_appointments']);
        }
      });

  }

  scheduledAppointment() {
    this.isScheduledAppointment = true;
    this.isBookAppointment = false;
    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately

    // get particular patient appointments using getAppointments method of DataService 

    this.dataService.getAppointments(this.patient.id)
      .subscribe(res => {
        if (res) {
          this.ScheduledAppointmentResponse = res;
        }
      });
  }

  cancelAppointment(id) {

    // delete selected appointment uing service

    // After deleting the appointment, get particular patient appointments

    this.dataService.deleteAppointment(id)
      .subscribe(res => {
        if (res) {
          console.log('Appointment deleted!');
          this.dataService.getAppointments(this.patient.id)
          .subscribe(res1 => {
            if (res) {
              this.ScheduledAppointmentResponse = res1;
            }
          });
        }
      });

  }
  
}
