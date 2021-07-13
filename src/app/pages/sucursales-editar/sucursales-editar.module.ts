import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SucursalesEditarPageRoutingModule } from './sucursales-editar-routing.module';

import { SucursalesEditarPage } from './sucursales-editar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SucursalesEditarPageRoutingModule
  ],
  declarations: [SucursalesEditarPage]
})
export class SucursalesEditarPageModule {}
