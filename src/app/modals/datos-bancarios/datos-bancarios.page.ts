import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-datos-bancarios',
  templateUrl: './datos-bancarios.page.html',
  styleUrls: ['./datos-bancarios.page.scss'],
})
export class DatosBancariosPage implements OnInit {

  constructor (private modalController: ModalController, private database: DatabaseService,
    private loadingController: LoadingController) { }

  async ngOnInit () {
    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.database.get_datos ('bancos').toPromise ().then ((res: any) => {
      console.log (res);
      loading.dismiss ();
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  view_checkout () {
    this.modalController.dismiss ();
  }


}
