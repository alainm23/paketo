import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SobrePaketoPage } from './sobre-paketo.page';

const routes: Routes = [
  {
    path: '',
    component: SobrePaketoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SobrePaketoPageRoutingModule {}
