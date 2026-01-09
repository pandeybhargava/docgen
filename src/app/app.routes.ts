import { Routes } from '@angular/router';
import { GeneratorComponent } from './components/generator/generator';
import { ConfigurationComponent } from './components/configuration/configuration';

export const routes: Routes = [
  { 
    path: '', 
    component: GeneratorComponent,
    title: 'Documentation Requirements Generator'
  },
  { 
    path: 'config', 
    component: ConfigurationComponent,
    title: 'Document Configuration'
  },
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  }
];