import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = sessionStorage;

  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) { }


  ngOnInit() {

    // Subscribe to authentication state changes

    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }

  getUserDetails() {
    if (this.isAuthenticated) {

      // Fetch the user logged in user details (user's claims)

      // User full name is exposed as a property name

      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string

          const userEmail = res.email as string;

          this.storage.setItem('userEmail', JSON.stringify(userEmail));
        }
      )
    }
  }

  logout() {
    // Terminates the session with Okta and remove current tokens.

    this.oktaAuth.signOut();
  }
}

