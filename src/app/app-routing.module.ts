import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';

const routes: Routes = [
    { path: "login", component: AuthComponent },
    { path: "signup", component: AuthComponent },
    { path: "login", redirectTo: "/login" }
    { path: "signup", redirectTo: "/signup" }
    { path: "**", redirectTo: "/login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
