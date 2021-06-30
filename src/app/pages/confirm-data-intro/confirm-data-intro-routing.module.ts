import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmDataIntroPage } from './confirm-data-intro.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmDataIntroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmDataIntroPageRoutingModule {}
