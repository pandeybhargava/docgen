import { Routes } from '@angular/router';
import { GeneratorComponent } from './components/generator/generator';
import { ConfigurationComponent } from './components/configuration/configuration';
import { LoginComponent } from './components/login/login.component';
import { authGuard, adminGuard } from './components/auth/auth.guard';
import { AdminLogsComponent } from './components/admin-logs/admin-logs.component';
import { ChangeRequestListComponent } from './components/crs/change-request-list.component';
import { ChangeRequestViewComponent } from './components/crv/change-request-view.component';
import { ChangeRequestFormComponent } from './components/crf/change-request-form.component';


export const routes: Routes = [
{ 
    path: '', 
    redirectTo: '/login',
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
    path: 'change-requests', 
    component: ChangeRequestListComponent,
    title: 'Change Requests',
    canActivate: [authGuard]
  },
  { 
    path: 'change-requests/new', 
    component: ChangeRequestFormComponent,
    title: 'New Change Request',
    canActivate: [authGuard]
  },
  { 
    path: 'change-requests/:id', 
    component: ChangeRequestViewComponent,
    title: 'View Change Request',
    canActivate: [authGuard]
  },
  { 
    path: 'change-requests/:id/edit', 
    component: ChangeRequestFormComponent,
    title: 'Edit Change Request',
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
    redirectTo: '/login',
    pathMatch: 'full'
  }
];