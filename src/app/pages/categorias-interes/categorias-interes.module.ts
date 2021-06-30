import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasInteresPageRoutingModule } from './categorias-interes-routing.module';

import { CategoriasInteresPage } from './categorias-interes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriasInteresPageRoutingModule
  ],
  declarations: [CategoriasInteresPage]
})
export class CategoriasInteresPageModule {}
