import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AcceuilComponent } from './acceuil/acceuil.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: AcceuilComponent }, // Default route (main page)
  { path: 'register', component: RegisterComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }