import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurcursalesPage } from './surcursales.page';

const routes: Routes = [
  {
    path: '',
    component: SurcursalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurcursalesPageRoutingModule {}
