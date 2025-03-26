import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AcceuilComponent } from './acceuil/acceuil.component';
import { RegisterComponent } from './register/register.component';
import { BenevolatComponent } from './benevolat/benevolat.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: AcceuilComponent }, // Default route (main page)
  { path: 'register', component: RegisterComponent }, 
  { path: 'benevolat', component: BenevolatComponent}, 
  { path : 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }