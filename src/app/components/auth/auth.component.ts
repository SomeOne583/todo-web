import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  action: string

  constructor(private router: Router, private location: Location) { }

  changeAction() {
    this.action === "/login" ? this.action = "/signup" : this.action = "/login"
    this.location.replaceState(this.action);
  }

  ngOnInit(): void {
    this.action = this.router.url;
  }

}
