import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosBancariosPageRoutingModule } from './datos-bancarios-routing.module';

import { DatosBancariosPage } from './datos-bancarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosBancariosPageRoutingModule
  ],
  declarations: [DatosBancariosPage]
})
export class DatosBancariosPageModule {}
