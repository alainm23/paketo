import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraciasPedidoPage } from './gracias-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: GraciasPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraciasPedidoPageRoutingModule {}
