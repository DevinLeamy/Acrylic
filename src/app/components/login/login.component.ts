import { Component } from "@angular/core";
import { AuthService } from "../../services/firebase";

@Component({
  selector: 'app-login-page',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginPageComponent {
  constructor(public authService : AuthService) {}
}
