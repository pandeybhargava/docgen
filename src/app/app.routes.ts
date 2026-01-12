import { Routes } from '@angular/router';
import { GeneratorComponent } from './components/generator/generator';
import { ConfigurationComponent } from './components/configuration/configuration';
import { LoginComponent } from './components/login/login.component';
import { authGuard, adminGuard } from './components/auth/auth.guard';
import { AdminLogsComponent } from './components/admin-logs/admin-logs.component';

export const routes: Routes = [
{ 
    path: '', 
    redirectTo: '/login', // Redirect root to login
    pathMatch: 'full'
  },
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Login - Documentation Generator'
  },
  { 
    path: 'generator', 
    component: GeneratorComponent,
    title: 'Documentation Requirements Generator',
    canActivate: [authGuard]
  },
  { 
    path: 'config', 
    component: ConfigurationComponent,
    title: 'Document Configuration',
    canActivate: [authGuard]
  },
  { 
    path: 'admin/logs', 
    component: AdminLogsComponent,
    title: 'Login Logs',
    canActivate: [adminGuard]
  },
  { 
    path: '**', 
    redirectTo: '/login', // Redirect all unknown routes to login
    pathMatch: 'full'
  }
];