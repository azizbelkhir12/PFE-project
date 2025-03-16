import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,  } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BenevoleCompteComponent } from './benevole-compte/benevole-compte.component';
import { BeneficiaireCompteComponent } from './beneficiaire-compte/beneficiaire-compte.component';
import { DonateurParrainCompteComponent } from './donateur-parrain-compte/donateur-parrain-compte.component';
import { DonateurStandardCompteComponent } from './donateur-standard-compte/donateur-standard-compte.component';
import { AdminCompteComponent } from './admin-compte/admin-compte.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { NavbarcompteAdminComponent } from './navbarcompte-admin/navbarcompte-admin.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Importez FontAwesomeMod





@NgModule({
  declarations: [
    AppComponent,
    AcceuilComponent,
    RegisterComponent,
    LoginComponent,
    BenevoleCompteComponent,
    BeneficiaireCompteComponent,
    DonateurParrainCompteComponent,
    DonateurStandardCompteComponent,
    AdminCompteComponent,
    AdminLoginComponent,
    SidebarAdminComponent,
    NavbarcompteAdminComponent, // Le composant est bien déclaré ici
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule, // FontAwesomeModule est bien importé ici
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
