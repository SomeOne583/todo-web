import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = "https://todo-api-177.herokuapp.com/";

  // httpOptions = {
  //   headers: new HttpHeaders(`Access-Control-Allow-Origin: ${this.url}login`)
  // };

  constructor(private http: HttpClient) { }

  login(user: object) {
    return this.http.post(`${this.url}login`, user)
  }
}
