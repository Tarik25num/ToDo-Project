import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CreateUser {
  private http = inject (HttpClient)
  private apiUrl = 'https://todof.woopear.fr/api/v1/user'

  createUser(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl + "/register", user);
  }
}
