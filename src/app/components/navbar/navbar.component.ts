import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../services/firebase";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  authenticated = false;
  authenticatedSub: Subscription
  constructor(public authService: AuthService, private router : Router) {}

  ngOnInit() {
    this.authenticatedSub = this.authService.getAuthUpdated().subscribe(authenticated => {
      this.authenticated = authenticated
      if (this.authenticated) {
        // User is authenticated - Got to canvas page
        this.router.navigate(['canvas'])
      } else {
        // User is not authenticated - Got to login page
        this.router.navigate(['login'])
      }
    });
  }

  ngOnDestroy() {
    this.authenticatedSub.unsubscribe()
  }
}
