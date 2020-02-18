import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Users } from '../../models/users.model';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  // used as a flag to display or hide form
  editProfile = false;
  userId = -1;
  private userDetails = new Users;

  editProfileForm: FormGroup;
  userImg = './../../assets/user.jpg';
  mobileErrMsg = 'You must enter a valid mobile number';
  emailErrMsg = 'You must enter a valid Email ID';
  locationErrMsg = 'You must enter the location';

  constructor(private dataService: DataService,
    private fb: FormBuilder) { }

  ngOnInit() {

    // add necessary validators
    // username should be disabled. it should not be edited

    this.editProfileForm = this.fb.group({
      userName: [null],
      mobile: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: [null, [Validators.required, Validators.pattern('[a-z0-9.@]*')]],
      location: [null, [Validators.required]]
    });

    // get login status from service
    // get userId from service and assign it to userId property
    // get profile details and display it
    this.userDetails = {
      userId: 1,
      username: 'test',
      mobile: '1234567890',
      email: 'test@test.com',
      location: 'testLocation'
    }
    this.userId = this.dataService.getUserId();
    this.getProfileDetails();

  }

  changeMyProfile() {
    // if successfully changed the profile it should display new details hiding the form
    const userDetails = {
      userId: this.userId,
      username: this.editProfileForm.get('userName').value,
      mobile: this.editProfileForm.get('mobile').value,
      email: this.editProfileForm.get('email').value,
      location: this.editProfileForm.get('location').value
    };
    this.dataService.updateProfile(userDetails)
      .subscribe(res => {
        if (res) {
          this.getProfileDetails();
          this.discardEdit();
          this.userDetails = userDetails;
          this.editProfile = false;
        }
      });

  }

  editMyProfile() {
    this.editProfile = true;
    // change editProfile property value appropriately
    this.editProfileForm.get('userName').setValue(this.userDetails.username);
    this.editProfileForm.get('mobile').setValue(this.userDetails.mobile);
    this.editProfileForm.get('email').setValue(this.userDetails.email);
    this.editProfileForm.get('location').setValue(this.userDetails.location);

  }

  discardEdit() {
    this.editProfile = false;
    // change editProfile property value appropriately

  }

  getProfileDetails() {
    // retrieve user details from service using userId
    if (this.userId) {
      this.dataService.getUserDetails(Number(this.userId))
        .subscribe(res => {
          console.log(res);
          if (res) {
            this.userDetails = res;
            //this.editProfileForm.setValue(res);
            this.editProfile = false;
          }
        },
        (error)=>{
          console.log(error);
            this.editProfileForm.get('userName').setValue('');
            this.editProfileForm.get('mobile').setValue('');
            this.editProfileForm.get('email').setValue('');
            this.editProfileForm.get('location').setValue('');
        });
    }
  }

}
