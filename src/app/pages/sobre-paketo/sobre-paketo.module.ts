import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SobrePaketoPageRoutingModule } from './sobre-paketo-routing.module';

import { SobrePaketoPage } from './sobre-paketo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SobrePaketoPageRoutingModule
  ],
  declarations: [SobrePaketoPage]
})
export class SobrePaketoPageModule {}
