import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from "./components/login/login.component";
import { CanvasPageComponent } from "./components/canvas/canvas.component";

const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'canvas', component: CanvasPageComponent },
    { path: '*', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
