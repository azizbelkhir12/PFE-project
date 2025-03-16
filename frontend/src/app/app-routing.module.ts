import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { RegisterComponent } from './register/register.component';
import { BenevoleCompteComponent } from './benevole-compte/benevole-compte.component';
import { BeneficiaireCompteComponent } from './beneficiaire-compte/beneficiaire-compte.component';
import { DonateurParrainCompteComponent } from './donateur-parrain-compte/donateur-parrain-compte.component';
import { DonateurStandardCompteComponent } from './donateur-standard-compte/donateur-standard-compte.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';  // Ajoutez ici la route pour AdminLogin
import { AdminCompteComponent } from './admin-compte/admin-compte.component';

const routes: Routes = [
  { path: '', component: AcceuilComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'benevole-compte', component: BenevoleCompteComponent },
  { path: 'beneficiaire-compte', component: BeneficiaireCompteComponent },
  { path: 'donateur-parrain-compte', component: DonateurParrainCompteComponent },
  { path: 'donateur-standard-compte', component: DonateurStandardCompteComponent },
  { path: 'admin-login', component: AdminLoginComponent },  // Route pour la connexion administrateur
  { path: 'admin-compte', component: AdminCompteComponent },  // Route pour l'interface admin après connexion
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
