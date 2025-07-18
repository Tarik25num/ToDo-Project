import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Task {
  private http = inject(HttpClient)
  private apiUrl = 'https://todof.woopear.fr/api/v1'

  createTask(task: { label: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/task`, task)
  }
 
  getTasks(): Observable <{ data: any[] }> {
    return this.http.get <{ data: any[] }> (`${this.apiUrl}/task`)
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/task/${id}/user`)
  }

  updateTaskDone(id: string, done: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/task/${id}/done/user`, { done })
  }

  updateTaskLabel(id: string, label: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/task/${id}/label/user`, { label })
  }
}


