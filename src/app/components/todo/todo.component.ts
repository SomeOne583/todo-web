import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { TodoListService } from '../../services/todo-list.service';
import { AuthService } from '../../services/auth.service';
import { MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface Todo {
  id: number,
  task: string,
  state: string,
  user_id: number,
  created_at: string,
  updated_at: string
}

export interface Session {
  id: number,
  email: string,
  created_at: string,
  updated_at: string,
  jti: string
}

export interface Notification {
  id: number,
  notification: string,
  user_id: number,
  created_at: string,
  updated_at: string
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  @Input() token: string;
  @Input() session: Session;
  @ViewChild('mainTable', { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  todos: Todo[] = [];
  todosDataSource: MatTableDataSource<Todo>;
  notifications: Notification[] = [];
  newTodoColumns: string[] = ['id-to-add', 'task-to-add', 'state-to-add', 'button-add'];
  displayedColumns: string[] = ['id', 'task', 'state', 'actions'];
  filterColumns: string[] = ['filter-empty', 'filter-input'];
  task: string = '';
  dialogRef: MatDialogRef<UpdateDialog>;
  notificationRef: MatDialogRef<NotificationDialog>;
  updatedTask: string;
  owner: string;
  hideMatBadge: boolean = true;
  
  constructor(private location: Location, private todoListService: TodoListService, public dialog: MatDialog, private _snackBar: MatSnackBar,
              private authService: AuthService) {
    this.todosDataSource = new MatTableDataSource<Todo>(this.todos);
    this.todosDataSource.paginator = this.paginator;
    this.todosDataSource.sort = this.sort;
  }
  
  updateValue(event: any) {
    this.task = event.target.value;
    event.target.value = "";
  }

  create(task: string) {
    this.todoListService.createTodo(this.token, task)
    .subscribe((resp) => {
      this.task = "";
      this.todos.push(resp.body);
      this.todosDataSource = new MatTableDataSource<Todo>(this.todos);
      this.todosDataSource.paginator = this.paginator;
      this.todosDataSource.sort = this.sort;
      this.table.renderRows();
    },
    (err) => {
      if (this.task === "") {
        this._snackBar.open("La tarea no puede estar vacia", "", {duration: 5000});
      } else {
        console.log(err);
      }
    })
  }

  update(todo: Todo, index: number) {
    this.updatedTask = todo.task;
    this.owner = this.session.email;
    this.dialogRef = this.dialog.open(UpdateDialog, {
      width: '700px',
      data: { task: this.updatedTask, owner: this.owner }
    });

    this.dialogRef.afterClosed()
    .subscribe((result) => {
      if (result) {
        if ( result.task == "" ) {
          this._snackBar.open("La tarea no puede estar vacia", "", {duration: 5000});
        } else if ( result.task == todo.task && result.owner == this.session.email ) {
          this._snackBar.open("No hay cambios que actualizar", "", {duration: 5000});
        } else {
          this.todoListService.updateTodo(this.token, todo.id, result.task, result.owner)
          .subscribe((resp) => {
            if (result.owner != this.session.email) {
              this.todos.splice(index, 1);
              this.todosDataSource = new MatTableDataSource<Todo>(this.todos);
              this.todosDataSource.paginator = this.paginator;
              this.todosDataSource.sort = this.sort;
              this.table.renderRows();
            } else {
              todo.task = result.task;
            }
          },
          (err) => {
            this._snackBar.open("Operación fallida: Ese usuario no existe", "", {duration: 5000});
          });
        }
      }
    },
    (err) => {
      console.log(err);
    });
  }

  destroy(todo: Todo, index: number) {
    this.todoListService.destroyTodo(this.token, todo.id)
    .subscribe((resp) => {
      console.log(resp);
      this.todos.splice(index, 1);
      this.todosDataSource = new MatTableDataSource<Todo>(this.todos);
      this.todosDataSource.paginator = this.paginator;
      this.todosDataSource.sort = this.sort;
      this.table.renderRows();
    },
    (err) => {
      console.log(err);
    })
  }

  start(todo: Todo) {
    this.todoListService.updateTodoState(this.token, todo.id, "En proceso")
    .subscribe((resp) => {
      todo.state = "En proceso";
    },
    (err) => {
      console.log(err);
    })
  }
  
  cancel(todo: Todo) {
    this.todoListService.updateTodoState(this.token, todo.id, "Nueva")
    .subscribe((resp) => {
      todo.state = "Nueva";
    },
    (err) => {
      console.log(err);
    })
  }
  
  finish(todo: Todo) {
    this.todoListService.updateTodoState(this.token, todo.id, "Terminada")
    .subscribe((resp) => {
      todo.state = "Terminada";
    },
    (err) => {
      console.log(err);
    })
  }

  logout() {
    this.authService.logout(this.token)
    .subscribe((resp) => {
      localStorage.removeItem("token");
      window.location.reload();
    },
    (err) => {
      console.log(err);
    });
  }

  notificationPanel() {
    this.notificationRef = this.dialog.open(NotificationDialog, {
      width: '700px',
      data: {
        notifications: this.notifications,
        token: this.token
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.todosDataSource.filter = filterValue.trim().toLowerCase();

    if (this.todosDataSource.paginator) {
      this.todosDataSource.paginator.firstPage();
    }
  }
  
  ngOnInit(): void {
    this.location.replaceState("/tareas");
    this.todoListService.getTodos(this.token)
    .subscribe((resp) => {
      this.todos = resp.body;
      this.todosDataSource = new MatTableDataSource<Todo>(this.todos);
      this.todosDataSource.paginator = this.paginator;
      this.todosDataSource.sort = this.sort;
    },
    (err) => {
      console.log(err);
    });
    this.todosDataSource.paginator = this.paginator;
    this.todosDataSource.sort = this.sort;
    this.todoListService.getNotifications(this.token)
    .subscribe((resp) => {
      this.notifications = resp.body;
      (this.notifications.length == 0) ? (this.hideMatBadge = true) : (this.hideMatBadge = false);
    },
    (err) => {
      console.log(err);
    });
  }
}

@Component({
  selector: 'dialog-model',
  templateUrl: 'dialog.html',
  styleUrls: ['dialog.scss'],
})
export class UpdateDialog {
  constructor(
    public dialogRef: MatDialogRef<UpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { task: string, owner: string }
  ) {}
}

@Component({
  selector: 'notifications-dialog',
  templateUrl: 'notification.html',
  styleUrls: ['notification.scss'],
})
export class NotificationDialog {
  @ViewChild('notificationPanel', { static: true }) notificationPanel: MatTable<any>;

  displayedColumns: string[] = ['id', 'notifications', 'delete'];
  notifications: Notification[] = this.data.notifications;

  constructor(
    private todoListService: TodoListService,
    public dialogRef: MatDialogRef<NotificationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { notifications: Notification[], token: string }
  ) {}

  destroyNotification(notification: Notification, index: number) {
    this.todoListService.destroyNotification(this.data.token, notification.id)
    .subscribe((resp) => {
      console.log(resp);
      this.data.notifications.splice(index, 1);
      this.notificationPanel.renderRows();
    },
    (err) => {
      console.log(err);
    });
  }
}
