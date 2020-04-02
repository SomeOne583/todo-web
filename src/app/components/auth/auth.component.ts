import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  action: string;
  emailFormControl: FormControl;
  passwordFormControl: FormControl;
  user: object;

  constructor(private router: Router, private location: Location, private _snackBar: MatSnackBar, private authService: AuthService) { }

  changeAction() {
    this.action === "/login" ? this.action = "/signup" : this.action = "/login";
    this.location.replaceState(this.action);
  }

  register(mail: string, password: string, password_confimation: string) {
    if (this.emailFormControl.invalid) {
      this._snackBar.open("Hay un error en tu correo", "", {duration: 5000});
    } else if(this.passwordFormControl.invalid) {
      this._snackBar.open("Hay un error en tu contraseña", "", {duration: 5000});
    } else if (!(password === password_confimation)) {
      this._snackBar.open("Las contraseñas no coinciden", "", {duration: 5000});
    } else {
      
    }
  }

  login(mail: string, password: string) {
    if (this.emailFormControl.invalid) {
      this._snackBar.open("Hay un error en tu correo", "", {duration: 5000});
    } else if(this.passwordFormControl.invalid) {
      this._snackBar.open("Hay un error en tu contraseña", "", {duration: 5000});
    } else {
      this.user = {
        "user": {
          "email": mail,
          "password": password
        }
      }
      this.authService.login(this.user).subscribe((response) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>");
        console.log(response);
        console.log(">>>>>>>>>>>>>>>>>>>>>>");
      });
    }
  }

  ngOnInit(): void {
    this.action = this.router.url;

    this.emailFormControl = new FormControl(
      '', 
      [
        Validators.required,
        Validators.email
      ]
    )

    this.passwordFormControl = new FormControl(
      '', [
        Validators.required,
        Validators.minLength(8)
      ]
    )
  }

}
