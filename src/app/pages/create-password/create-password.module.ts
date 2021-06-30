import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePasswordPageRoutingModule } from './create-password-routing.module';

import { CreatePasswordPage } from './create-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreatePasswordPage]
})
export class CreatePasswordPageModule {}
