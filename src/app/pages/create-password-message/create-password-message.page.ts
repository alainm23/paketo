import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-password-message',
  templateUrl: './create-password-message.page.html',
  styleUrls: ['./create-password-message.page.scss'],
})
export class CreatePasswordMessagePage {

  constructor (private navController: NavController) {

  }

  go_page () {
    this.navController.navigateForward (['confirm-data-intro']);
  }
}
