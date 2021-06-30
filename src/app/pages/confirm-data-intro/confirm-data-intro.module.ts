import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmDataIntroPageRoutingModule } from './confirm-data-intro-routing.module';

import { ConfirmDataIntroPage } from './confirm-data-intro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmDataIntroPageRoutingModule
  ],
  declarations: [ConfirmDataIntroPage]
})
export class ConfirmDataIntroPageModule {}
