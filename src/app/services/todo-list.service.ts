import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  url = "https://todo-api-177.herokuapp.com/webhook";

  constructor(private http: HttpClient) { }

  createTodo(token: string, task: string): Observable<any> {
    let http_header = new HttpHeaders({"Authorization": token});
    return this.http.post<any>(
      this.url,
      { options: { operation: "create", task: task } },
      { observe: 'response', headers: http_header }
    )
  }

  getTodos(token: string): Observable<any> {
    let http_header = new HttpHeaders({"Authorization": token});
    return this.http.post<any>(
      this.url,
      {options: { operation: "read"} },
      { observe: 'response', headers: http_header }
    );
  }
  
  updateTodoState(token: string, todoID: number, newState: string): Observable<any> {
    let http_header = new HttpHeaders({"Authorization": token});
    return this.http.post<any>(
      this.url,
      { options: { operation: "update", todo_id: todoID, new_state: newState } },
      { observe: 'response', headers: http_header }
    );
  }

  updateTodo(token: string, todoID: number, newTask: string, newOwner: string): Observable<any> {
    let http_header = new HttpHeaders({"Authorization": token});
    return this.http.post<any>(
      this.url,
      { options: { operation: "update", todo_id: todoID, new_task: newTask, new_email: newOwner } },
      { observe: 'response', headers: http_header }
    );
  }
    
  destroyTodo(token: string, todoID: number): Observable<any> {
    let http_header = new HttpHeaders({"Authorization": token});
    return this.http.post<any>(
      this.url,
      { options: { operation: "destroy", todo_id: todoID } },
      { observe: 'response', headers: http_header }
    );
  }

  getNotifications(token: string): Observable<any> {
    let http_header = new HttpHeaders({"Authorization": token});
    return this.http.post<any>(
      this.url,
      { options: { operation: "notifications" } },
      { observe: 'response', headers: http_header }
    );
  }

  destroyNotification(token: string, notificationId: number): Observable<any> {
    let http_header = new HttpHeaders({"Authorization": token});
    return this.http.post<any>(
      this.url,
      { options: { operation: "destroy_notification", notification_id: notificationId } },
      { observe: 'response', headers: http_header }
    );
  }
}
