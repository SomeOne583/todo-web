import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { TodoComponent } from './components/todo/todo.component';

const routes: Routes = [
    { path: "login", component: AuthComponent },
    { path: "signup", component: AuthComponent },
    { path: "**", redirectTo: "/login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
