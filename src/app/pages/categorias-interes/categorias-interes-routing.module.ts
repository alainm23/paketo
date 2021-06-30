import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriasInteresPage } from './categorias-interes.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriasInteresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriasInteresPageRoutingModule {}
