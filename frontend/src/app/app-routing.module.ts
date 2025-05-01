import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { RegisterComponent } from './register/register.component';
import { BenevolatComponent } from './benevolat/benevolat.component';
import { BenevoleCompteComponent } from './benevole-compte/benevole-compte.component';
import { BeneficiaireCompteComponent } from './beneficiaire-compte/beneficiaire-compte.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminCompteComponent } from './admin-compte/admin-compte.component';
import { GestionBenevolesComponent } from './gestion-benevoles/gestion-benevoles.component';
import { GestionBeneficiairesComponent } from './gestion-beneficiaires/gestion-beneficiaires.component';
import { GestionDesDonsComponent } from './gestion-des-dons/gestion-des-dons.component';
import { ContactComponent } from './contact/contact.component';
import { GestionNotificationComponent } from './gestion-notification/gestion-notification.component';
import { GestionDesRapportsComponent } from './gestion-des-rapports/gestion-des-rapports.component';
import { GestionDesProjetsComponent } from './gestion-des-projets/gestion-des-projets.component';
import { DonRapideComponent } from './don-rapide/don-rapide.component';
import { PaymentFailComponent } from './pages/payment-fail/payment-fail.component';

import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { GestionFeedbackComponent } from './gestion-feedback/gestion-feedback.component';
import { VoirDocumentsBeneficiaireComponent } from './voir-documents-beneficiaire/voir-documents-beneficiaire.component';
import { RapportsComponent } from './rapports/rapports.component';
import { DonateurCompteComponent } from './donateur-compte/donateur-compte.component';



const routes: Routes = [
  { path: '', component: AcceuilComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'benevolat', component: BenevolatComponent },
  { path: 'donateur-compte', component: DonateurCompteComponent },
  { path: 'benevole-compte', component: BenevoleCompteComponent, canActivate: [AuthGuard] },
  { path: 'beneficiaire-compte', component: BeneficiaireCompteComponent, canActivate: [AuthGuard] },


  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'payment', component: DonRapideComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-fail', component: PaymentFailComponent },
  { path: 'rapports', component: RapportsComponent,  },




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
      { path: 'gestion-des-projets', component: GestionDesProjetsComponent },
      { path: 'gestion-feedback', component: GestionFeedbackComponent },
      { path: 'voir-documents-beneficiaire', component: VoirDocumentsBeneficiaireComponent },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
