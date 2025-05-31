import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TaskService } from '../../services/task.service';
import { TaskListComponent } from '../task-list/task-list.component';
import { ToastController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TaskListComponent, IonicModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  username = 'Guest';
  totalTasks = 0;
  completedTasks = 0;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.username = decoded.username || 'User';
      } catch (err) {
        console.error('Invalid token:', err);
      }

      this.refreshStats();
    }
  }

  refreshStats(): void {
    this.taskService.getTaskStats().subscribe({
      next: (res) => {
        this.totalTasks = res.totalTasks;
        this.completedTasks = res.completedTasks;
      },
      error: (err) => console.error('Failed to fetch stats', err),
    });
  }

  get pendingTasks(): number {
    return this.totalTasks - this.completedTasks;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    await this.showToast('Logged out successfully', 'warning');
    this.router.navigate(['/login']);
  }

  private async showToast(message: string, color: 'success' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
