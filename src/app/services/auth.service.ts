import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = "https://todo-api-177.herokuapp.com/";

  constructor(private http: HttpClient) { }

  register(user: object): Observable<any> {
    return this.http.post<any>(`${this.url}signup`, user, { observe: 'response'});
  }
  
  login(user: object): Observable<any> {
    return this.http.post<any>(`${this.url}login`, user, { observe: 'response'});
  }

  checkLog(token: string): Observable<any> {
    let http_header = new HttpHeaders({'Authorization': token});    
    return this.http.post<any>(`${this.url}login`, "", { observe: 'response', headers: http_header})
  }

  logout(token: string): Observable<any> {
    let http_header = new HttpHeaders({'Authorization': token});
    return this.http.delete(`${this.url}logout`, { observe: 'response', headers: http_header })
  }
}
