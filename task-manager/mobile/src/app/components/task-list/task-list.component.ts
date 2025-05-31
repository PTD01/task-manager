import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  @Output() tasksChanged = new EventEmitter<void>();

  tasks: Task[] = [];
  editMode: boolean = false;

  taskToEdit: Task = {
    title: '',
    description: '',
    completed: false,
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loadTasks();
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => (this.tasks = res),
      error: (err) => console.error('Failed to load tasks', err),
    });
  }

  markComplete(task: Task) {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(task._id!, updatedTask).subscribe(() => {
      this.loadTasks();
      this.tasksChanged.emit();
    });
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.loadTasks();
      this.tasksChanged.emit();
    });
  }

  setEditTask(task: Task) {
    this.editMode = true;
    this.taskToEdit = { ...task };
  }

  cancelEdit() {
    this.editMode = false;
    this.taskToEdit = { title: '', description: '', completed: false };
  }

  updateTask() {
    if (this.taskToEdit._id) {
      this.taskService
        .updateTask(this.taskToEdit._id, this.taskToEdit)
        .subscribe(() => {
          this.cancelEdit();
          this.loadTasks();
          this.tasksChanged.emit();
        });
    }
  }

  createTask() {
    if (this.taskToEdit.title) {
      this.taskService.createTask(this.taskToEdit).subscribe(() => {
        this.cancelEdit();
        this.loadTasks();
        this.tasksChanged.emit();
      });
    }
  }
}
