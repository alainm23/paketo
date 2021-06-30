import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurcursalesPageRoutingModule } from './surcursales-routing.module';

import { SurcursalesPage } from './surcursales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurcursalesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SurcursalesPage]
})
export class SurcursalesPageModule {}
