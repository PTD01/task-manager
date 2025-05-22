import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private URL = 'https://taskapp-syz0.onrender.com/api/tasks'; // Use this for deployment

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {}; // SSR-safe: no localStorage access
    }

    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.URL, {
      headers: this.getAuthHeaders(),
    });
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.URL, task, {
      headers: this.getAuthHeaders(),
    });
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.URL}/${id}`, task, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getTaskStats(): Observable<{ totalTasks: number; completedTasks: number }> {
    return this.http.get<{ totalTasks: number; completedTasks: number }>(
      `${this.URL}/stats`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
