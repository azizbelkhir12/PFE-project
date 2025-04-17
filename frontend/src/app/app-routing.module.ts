import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { RegisterComponent } from './register/register.component';
import { BenevolatComponent } from './benevolat/benevolat.component';
import { BenevoleCompteComponent } from './benevole-compte/benevole-compte.component';
import { BeneficiaireCompteComponent } from './beneficiaire-compte/beneficiaire-compte.component';
import { DonateurParrainCompteComponent } from './donateur-parrain-compte/donateur-parrain-compte.component';
import { DonateurStandardCompteComponent } from './donateur-standard-compte/donateur-standard-compte.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminCompteComponent } from './admin-compte/admin-compte.component';
import { GestionBenevolesComponent } from './gestion-benevoles/gestion-benevoles.component';
import { GestionBeneficiairesComponent } from './gestion-beneficiaires/gestion-beneficiaires.component';
import { GestionDesDonsComponent } from './gestion-des-dons/gestion-des-dons.component';
import { ContactComponent } from './contact/contact.component';
import { GestionNotificationComponent } from './gestion-notification/gestion-notification.component';
import { GestionDesRapportsComponent } from './gestion-des-rapports/gestion-des-rapports.component';
import { GestionDesArticlesComponent } from './gestion-des-articles/gestion-des-articles.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';

const routes: Routes = [
  { path: '', component: AcceuilComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'benevolat', component: BenevolatComponent },
  { path: 'benevole-compte', component: BenevoleCompteComponent, canActivate: [AuthGuard] },
  { path: 'beneficiaire-compte', component: BeneficiaireCompteComponent, canActivate: [AuthGuard] },
  { path: 'donateur-parrain-compte', component: DonateurParrainCompteComponent, canActivate: [AuthGuard] },
  { path: 'donateur-standard-compte', component: DonateurStandardCompteComponent, canActivate: [AuthGuard] },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'contact', component: ContactComponent },

  // Admin routes group (protected)
  {
    path: 'admin-compte',
    canActivate: [AuthGuard, AdminGuard], // Protect the entire admin section
    children: [
      { path: '', component: AdminCompteComponent }, // Main admin dashboard
      { path: 'gestion-benevoles', component: GestionBenevolesComponent },
      { path: 'gestion-beneficiaires', component: GestionBeneficiairesComponent },
      { path: 'gestion-des-dons', component: GestionDesDonsComponent },
      { path: 'gestion-notification', component: GestionNotificationComponent },
      { path: 'gestion-des-rapports', component: GestionDesRapportsComponent },
      { path: 'gestion-des-articles', component: GestionDesArticlesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
