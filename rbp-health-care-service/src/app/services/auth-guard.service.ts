
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { DataService } from './data.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  isLoggedIn = false
  constructor(public dataService: DataService, public router: Router) {
    this.dataService.isLogIn.subscribe(res => {
      if (res) {
        this.isLoggedIn = true;
      }
    })
   }

  canActivate(): boolean {
    // return true if authenticated else redirect to login page
    if (this.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }

}

