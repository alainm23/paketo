import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from '../../services/auth.service';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { UpdateSentDataPage } from '../../modals/update-sent-data/update-sent-data.page';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-confirm-data',
  templateUrl: './confirm-data.page.html',
  styleUrls: ['./confirm-data.page.scss'],
})
export class ConfirmDataPage implements OnInit {
  user: any;
  ruc: string = '';
  razon_social: string = '';
  telefono: string = '';
  persona_contacto: string = '';
  constructor (private auth: AuthService, private modalController: ModalController, 
    private navController: NavController, 
    private loadingController: LoadingController,
    private utils: UtilsService) { }

  async ngOnInit () {
    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.user = JSON.parse (await this.auth.get_user_data ());
    this.auth.get_fields (['ruc', 'razon_social', 'telefono', 'persona_contacto']).subscribe ((res: any) => {
      loading.dismiss ();
      console.log (res);
      this.ruc = res.ruc;
      this.razon_social = res.razon_social;
      this.telefono = res.telefono;
      this.persona_contacto = res.persona_contacto;
    }, error => {
      console.log (error);
      loading.dismiss ();
    });
  }

  async modificar () {
    const modal = await this.modalController.create ({
      component: UpdateSentDataPage,
      componentProps: {
        ruc: this.ruc,
        razon_social: this.razon_social,
        telefono: this.telefono,
        persona_contacto: this.persona_contacto
      },
      swipeToClose: true
    });

    modal.onDidDismiss ().then ((res: any) => {
      if (res.role === 'update') {
        this.ruc = res.data.ruc;
        this.razon_social = res.data.razon_social;
        this.telefono = res.data.telefono;
        this.persona_contacto = res.data.persona_contacto;
      }
    });
    
    return await modal.present();
  }

  async submit () {
    console.log (this.razon_social);
    console.log (this.ruc);
    console.log (this.telefono);
    console.log (this.persona_contacto);

    if (this.razon_social === '' || this.razon_social === null) {
      this.utils.presentToast ('La Razon Social es requerido', 'danger');
      this.modificar ();
      return;
    }

    if (this.ruc === '' || this.ruc === null) {
      this.utils.presentToast ('El numero de RUC es requerido', 'danger');
      this.modificar ();
      return;
    }

    if (this.telefono === '' || this.telefono === null) {
      this.utils.presentToast ('El numero de teléfono es requerido', 'danger');
      this.modificar ();
      return;
    }

    if (this.persona_contacto === '' || this.persona_contacto === null) {
      this.utils.presentToast ('El personal de contacto es requerido', 'danger');
      this.modificar ();
      return;
    }
    

    let request: any = {
      ruc: this.ruc,
      razon_social: this.razon_social,
      telefono: this.telefono,
      persona_contacto: this.persona_contacto,
    };

    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.auth.save_confirm_data (request).subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();

      if (res.status === true) {
        this.navController.navigateForward (['surcursales']);
      }
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }
}
