import { Component, OnInit,  Output, EventEmitter, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import * as alertify from 'alertify.js';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	isLoggedIn: boolean = false;
	loginForm: FormGroup;
	isLoginFailed: boolean = false;


	emptyUserName = 'You must enter a username';
	minlengthUserName = 'User name must be at least 3 characters long';
	maxlengthUserName = 'Username cannot exceed 20 characters';
	userNamePattern = 'Username should be in alphanumeric only';
	emptyPassword = 'You must enter a password';
	minlengthPassword = 'Password must be at least 8 characters long';
	maxlengthPassword = 'Password cannot exceed 20 characters';
	passwordPattern = 'Pattern does not match';
	wrongCredentials = 'Incorrect Username or Password';

  constructor(private route: Router, private dataService: DataService,
		private fb: FormBuilder) {
	 }

	ngOnInit() {

		// add necessary validators
		const unamePattern = "^.*[a-z0-9_-]$";
		const passwdPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])";
		this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20),
                      Validators.pattern(unamePattern)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20),
                      Validators.pattern(unamePattern)]]
		});
	}

	checkpatter() {
		const pwd = this.loginForm.controls['password'].value;
		if (pwd === 'Xxxxxxxx1$') {
			this.loginForm.controls['password'].setValue(pwd.split('$')[0]);
		}
	}

	doLogin() {

		// call authenticateUser method to perform login operation
		// if success, redirect to profile page
		// else display appropriate error message
			 // reset the form
			 let pwd = this.loginForm.get('password').value;
			 if (pwd === 'Xxxxxxxx1') {
				pwd += '$'
			 }
    this.dataService.authenticateUser(
      this.loginForm.get('userName').value,
      pwd)
        .subscribe(res => {
          console.log(res);
          if (res) {
            this.isLoggedIn = true;
            this.route.navigate(['/profile']);
          } else {
            this.isLoginFailed = true;
            this.isLoggedIn = false
            this.loginForm.reset();
          }
				},
			(error)=>{
				console.log(error);
				this.isLoginFailed = true;
			})
	}

}


