import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-datos-bancarios',
  templateUrl: './datos-bancarios.page.html',
  styleUrls: ['./datos-bancarios.page.scss'],
})
export class DatosBancariosPage implements OnInit {

  constructor (private modalController: ModalController) { }

  ngOnInit() {
  }

  view_checkout () {
    this.modalController.dismiss ();
  }
}
