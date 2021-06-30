import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePasswordMessagePageRoutingModule } from './create-password-message-routing.module';

import { CreatePasswordMessagePage } from './create-password-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePasswordMessagePageRoutingModule
  ],
  declarations: [CreatePasswordMessagePage]
})
export class CreatePasswordMessagePageModule {}
