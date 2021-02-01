import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule} from "@angular/material/icon";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from "@angular/material/slider";
import { environment } from "../environments/environment.prod";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ColorSketchModule } from "ngx-color/sketch";

import { AuthService } from "./services/firebase";
import { NgxImageCompressService } from "ngx-image-compress";

import { AppComponent } from './app.component';
import { ImageUploaderComponent } from "./../app/components/canvas/image-uploader/image-uploader.component";
import { LoginPageComponent } from "./components/login/login.component";
import { CanvasPageComponent } from "./components/canvas/canvas.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    CanvasPageComponent,
    NavbarComponent,
    ImageUploaderComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    ColorSketchModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [AuthService, NgxImageCompressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
