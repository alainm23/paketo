import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UpdateSentDataPage } from '../../modals/update-sent-data/update-sent-data.page';
@Component({
  selector: 'app-onboarding-no-usuario',
  templateUrl: './onboarding-no-usuario.page.html',
  styleUrls: ['./onboarding-no-usuario.page.scss'],
})
export class OnboardingNoUsuarioPage implements OnInit {

  constructor (private modalController: ModalController,
    private auth: AuthService,
    private loadingController: LoadingController,
    private navController: NavController,
    private alertController: AlertController) { }

  ngOnInit () {
  }

  async editar () {
    const modal = await this.modalController.create ({
      component: UpdateSentDataPage,
      componentProps: {
        ruc: '',
        razon_social: '',
        telefono: '',
        persona_contacto: '',
        nuevo_usuario: true
      },
      swipeToClose: true
    });

    modal.onDidDismiss ().then ((res: any) => {
      if (res.role === 'ok') {
        console.log (res.data);
        this.navController.navigateRoot (['login']).then (() => {
          this.show_alert ();
        });
      }
    });
    
    return await modal.present();
  }

  async show_alert () {
    const alert = await this.alertController.create({
      header: 'Solicitud enviada',
      message: 'Nos contacteremos con usted a la brevedad posible para poder brindarle sus accesos a nuestra aplicación',
      mode: 'ios',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });

    await alert.present ();
  }
}
