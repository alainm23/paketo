import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sucursales-editar',
  templateUrl: './sucursales-editar.page.html',
  styleUrls: ['./sucursales-editar.page.scss'],
})
export class SucursalesEditarPage implements OnInit {
  items: any [] = [];
  cart_item_count: BehaviorSubject<number>;
  constructor (private navController: NavController,
    private auth: AuthService,
    private cartService: CartService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private utils: UtilsService) { }

  ngOnInit () {
    this.cart_item_count = this.cartService.get_cart_item_count ();
  }

  async ionViewDidEnter () {
    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.auth.get_sucursales ().toPromise ().then ((res: any []) => {
      console.log (res);
      loading.dismiss ();
      this.items = res;
    }).catch ((error: any) => {
      console.log (error);
      loading.dismiss ();
    });
  }

  back () {
    this.navController.back ();
  }

  async delete (item: any) {
    const alert = await this.alertController.create ({
      header: 'Confirmar Operación',
      mode: 'ios',
      message: '¿Esta seguro que desea eliminar esta sucursal?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Confirmar',
          handler: async (data: any) => {
            const loading = await this.loadingController.create ({
              translucent: true,
              spinner: 'lines-small',
              mode: 'ios'
            });
        
            await loading.present ();

            this.auth.delete_sucursal (item.id).toPromise ().then ((res: any) => {
              console.log (res);
              loading.dismiss ();
              if (res.status === true) {
                this.utils.presentToast ('La sucursal se elimino correctamente', 'success');
                for (let index = 0; index < this.items.length; index++) {
                  if (this.items [index].id === item.id) {
                    this.items.splice (index, 1);
                  }
                }
              }
            }, error => {
              loading.dismiss ();
              this.utils.presentToast (error.error.message, 'danger');
              console.log (error);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  agregar_surcursal () {
    this.navController.navigateForward (['surcursales', 'new', 'sucursales-editar']);
  }

  editar (item: any) {
    this.navController.navigateForward (['surcursales', JSON.stringify (item), 'sucursales-editar']);
  }
}
