import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateSentDataPageRoutingModule } from './update-sent-data-routing.module';

import { UpdateSentDataPage } from './update-sent-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateSentDataPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateSentDataPage]
})
export class UpdateSentDataPageModule {}
