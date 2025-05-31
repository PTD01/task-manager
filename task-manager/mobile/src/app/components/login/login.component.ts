import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastController, IonicModule } from '@ionic/angular'; // ✅ import IonicModule and ToastController

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user = { username: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController // ✅ inject ToastController
  ) {}

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  onLogin() {
    this.authService.login(this.user).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.showToast('Login successful', 'success'); // ✅ Toast
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.showToast(
          'Login failed: ' + (err.error || 'Server error'),
          'danger'
        ); // ❌ Toast
        console.error(err);
      },
    });
  }
}
