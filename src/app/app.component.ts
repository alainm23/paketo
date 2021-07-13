import { Component } from '@angular/core';

// Services
import { Storage } from '@ionic/storage-angular';
import { Capacitor } from "@capacitor/core";
import { AlertController, LoadingController, MenuController, NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor (public storage: Storage,
      public platform: Platform,
      private cartService: CartService,
      public auth: AuthService,
      private location: Location,
      private navController: NavController,
      private menuController: MenuController,
      private alertController: AlertController,
      private loadingController: LoadingController) {
    this.OnInit ();
  }

  async OnInit () {
    await this.storage.create ();

    if (Capacitor.isNativePlatform ()) {
      this.platform.ready ().then (() => {
        this.init ();
      });
    } else {
      this.init ();
    }
  }

  async init () {
    App.addListener ('backButton', () => {
      if (this.location.isCurrentPathEqualTo ('/onboarding') || 
      this.location.isCurrentPathEqualTo ('/login') || 
      this.location.isCurrentPathEqualTo ('/home')) {
        App.exitApp ();
      } else {
        this.navController.back ();
      }
    });

    moment.locale ('es');
    
    let user_data: any = JSON.parse (await this.storage.get ('PAKETO_USER_DATA'));
    let user_access: any = JSON.parse (await this.storage.get ('PAKETO_USER_ACCESS'));

    if (user_data !== null && user_access !== null) {
      this.auth.USER_DATA = user_data;
      this.auth.USER_ACCESS = user_access;

      this.cartService.get_cloud_cart ();

      this.auth.update_user_data ().then ((res: any) => {
        console.log (res);
        if (this.auth.USER_DATA.password_updated_user <= 0) {
          this.navController.navigateForward ('create-password');
        } else if (this.auth.USER_DATA.datos_confirmados <= 0) {
          this.navController.navigateForward ('confirm-data-intro');
        } else if (this.auth.USER_DATA.sucursales <= 0) {
          this.navController.navigateForward ('surcursales');
        } else if (this.auth.USER_DATA.categorias <= 0) {
          this.navController.navigateForward ('categorias-interes');
        }
      });
    }
  }

  close_menu () {
    this.menuController.close ('menu');
  }

  async logout () {
    const alert = await this.alertController.create({
      header: 'Log out',
      message: '¿Está seguro que desea cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Confirmar',
          handler: async () => {
            const loading = await this.loadingController.create({
              translucent: true,
              spinner: 'lines-small',
              mode: 'ios'
            });

            await loading.present ();

            this.auth.logout ().subscribe (async (res: any) => {
              await loading.dismiss ();
              this.borrar_user_access ();
            }, async error => {
              await loading.dismiss ();
              this.borrar_user_access ();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  borrar_user_access () {
    this.storage.clear ().then (() => {
      this.navController.navigateRoot ('login');
    });
  }
}
