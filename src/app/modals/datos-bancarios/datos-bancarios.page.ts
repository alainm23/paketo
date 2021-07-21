import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { Clipboard } from '@capacitor/clipboard';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-datos-bancarios',
  templateUrl: './datos-bancarios.page.html',
  styleUrls: ['./datos-bancarios.page.scss'],
})
export class DatosBancariosPage implements OnInit {
  @Input () banco: any;
  constructor (private modalController: ModalController, private database: DatabaseService,
    private loadingController: LoadingController,
    private utils: UtilsService) { }

  async ngOnInit () {
    console.log (this.banco);
  }

  view_checkout () {
    this.modalController.dismiss ();
  }

  async copy (text: string) {
    Clipboard.write({string: text}).then (() => {
      this.utils.presentToast ('Copiado al portapapeles', 'success');
    });
  }
}
