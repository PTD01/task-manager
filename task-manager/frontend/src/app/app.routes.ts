import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'navbar', component: NavbarComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

export const appRouter = provideRouter(routes);
