import { Injectable } from "@angular/core";
import firebase from "firebase/app";
import { fabric } from "fabric";
import { Subject, Subscription } from "rxjs"
import { AuthService } from "./firebase";
import { User } from './user';

@Injectable({ providedIn: 'root' })
export class CanvasService {
  canvasUpdated = new Subject<string>();
  userSub: Subscription;
  user: User;

  constructor(private authService: AuthService) {
    // Get current user
    this.user = this.authService.user;
    // Listen for user updates
    this.userSub = this.authService.getUserUpdated().subscribe((user : User) => {
      this.user = user;
      firebase.database().ref(`users/${this.user.uid}/canvas`).on('value', (snapshot) => {
        const data = snapshot.val();
        this.updateCanvas(data);
      });
    });
  }

  // Get observable of the canvas
  getCanvasUpdated() {
    return this.canvasUpdated.asObservable();
  }

  // Set canvas
  persistCanvas(canvas: fabric.Canvas) {
    if (this.user === undefined || this.user === null) return;
    firebase.database().ref(`users/${this.user.uid}`).set({
      canvas: JSON.stringify(canvas)
    });
  }

  // Retrieves current saved canvas and updates observables
  getCanvas() {
    if (this.user === undefined || this.user === null) return;
    firebase.database().ref(`users/${this.user.uid}/canvas`).once('value', (snapshot) => {
      this.updateCanvas(snapshot.val());
    })
  }

  // Sends updated canvas to observables
  updateCanvas(canvasJSON: string) {
    this.canvasUpdated.next(canvasJSON);
  }
}
