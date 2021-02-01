import { Injectable, NgZone } from "@angular/core";
import { User } from "./user";
import firebase from "firebase/app";
import 'firebase/auth';
import "firebase/database";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {

  user: User;
  userUpdated = new Subject<User>();
  authenticated = false;
  authenticatedUpdated = new Subject<boolean>();

  constructor(
    public ngZone: NgZone,
    public router: Router,
    public auth: AngularFireAuth
  ) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.authenticated = true;
        this.updateAuthenticated();
      } else {
        this.authenticated = false;
        this.updateAuthenticated();
      }
      this.user = user as User;
      this.updateUser();
    })
  }

  getAuthUpdated() {
    return this.authenticatedUpdated.asObservable();
  }

  getUserUpdated() {
    return this.userUpdated.asObservable();
  }

  // Firebase Google Sign-in
  login() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          var provider = new firebase.auth.GoogleAuthProvider();
          this.auth.signInWithPopup(provider)
            .then(res => {
              this.ngZone.run(() => {
                this.router.navigate(['canvas']);
              })
            }).catch(error => window.alert(error))
      })
      .catch(error => {} );
  }

  // Logout
  logout() {
    this.auth.signOut()
      .then(() => {
        this.router.navigate(['login']);
      })
  }

  isLoggedIn() {
    return this.authenticated;
  }

  updateAuthenticated() {
    this.authenticatedUpdated.next(this.authenticated);
  }

  updateUser() {
    this.userUpdated.next({...this.user})
  }
}
