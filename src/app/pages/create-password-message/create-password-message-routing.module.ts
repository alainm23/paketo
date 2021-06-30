import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePasswordMessagePage } from './create-password-message.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePasswordMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePasswordMessagePageRoutingModule {}
