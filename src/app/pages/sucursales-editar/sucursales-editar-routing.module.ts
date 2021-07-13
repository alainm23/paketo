import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SucursalesEditarPage } from './sucursales-editar.page';

const routes: Routes = [
  {
    path: '',
    component: SucursalesEditarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SucursalesEditarPageRoutingModule {}
