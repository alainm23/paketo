import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraciasPedidoPageRoutingModule } from './gracias-pedido-routing.module';

import { GraciasPedidoPage } from './gracias-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraciasPedidoPageRoutingModule
  ],
  declarations: [GraciasPedidoPage]
})
export class GraciasPedidoPageModule {}
