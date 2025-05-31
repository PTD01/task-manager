import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user = { username: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
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

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: () => {
        this.showToast('Registration successful!', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.showToast(
          'Registration failed: ' + (err.error || 'Server error'),
          'danger'
        );
        console.error(err);
      },
    });
  }
}
