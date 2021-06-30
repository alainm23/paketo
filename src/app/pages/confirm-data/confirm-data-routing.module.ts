import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmDataPage } from './confirm-data.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmDataPageRoutingModule {}
