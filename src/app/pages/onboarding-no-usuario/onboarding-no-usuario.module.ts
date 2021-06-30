import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnboardingNoUsuarioPageRoutingModule } from './onboarding-no-usuario-routing.module';

import { OnboardingNoUsuarioPage } from './onboarding-no-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingNoUsuarioPageRoutingModule
  ],
  declarations: [OnboardingNoUsuarioPage]
})
export class OnboardingNoUsuarioPageModule {}
