import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { DatabaseService } from 'src/app/services/database.service';
import * as moment from 'moment';
import { DatosBancariosPage } from '../../modals/datos-bancarios/datos-bancarios.page';

import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { ActionSheetController, IonContent, IonSlides, LoadingController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  cart: any [] = [];
  surcursales: any [] = [];
  user: any;

  surcursal_selected: any = null;
  image_file: any = null;
  selected_segment: string ="deposito_bancario"

  constructor (private database: DatabaseService,
    private navController: NavController,
    private cartService: CartService,
    private auth: AuthService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private utils: UtilsService,
    private loadingController: LoadingController) { }

  ngOnInit () {
    this.user = this.auth.USER_DATA;
    this.cart = this.cartService.get_cart ();

    console.log (this.cart);
    console.log (this.user);

    this.auth.get_surcursales ().subscribe ((res: any []) => {
      console.log (res);
      this.surcursales = res;

      if (res.length > 0) {
        this.surcursal_selected = res [0];
      }
    }, error => {
      console.log (error);
    });
  }

  segmentChanged(ev: any) {
    this.selected_segment = ev.target.value
  }

  get_total (moneda: string) {
    let total: number = 0;

    this.cart.forEach ((item: any) => {
      if (item.moneda === moneda) {
        total += item.precio * item.cantidad;
      }
    });

    return total;
  }

  async submit () {
    if (this.selected_segment === 'contra_entrega' && this.user.confianza === 0) {
      this.utils.presentToast ('Usted no puede hacer uso de este servicio', 'danger');
      return;
    }
    // if (this.selected_segment == 'deposito_bancario' && this.image_file === null) {
    //   this.utils.presentToast ('Adjunte su comprobante de pago', 'danger');
    //   return;
    // }

    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    const formData: FormData = new FormData ();
    formData.append ('id_sucursal', this.surcursal_selected.id);
    formData.append ('fecha', moment ().format ('YYYY[-]MM[-]DD'));
    formData.append ('metodo_pago', this.selected_segment);
    // formData.append ('comprobante', this.image_file.blob, this.image_file.name);

    for (let index = 0; index < this.cart.length; index++) {
      formData.append (`productos[${index}][id]`, this.cart [index].id);
      formData.append (`productos[${index}][cantidad]`, this.cart [index].cantidad);
    }

    formData.forEach ((value, key) => {
      console.log ('Key:', key)
      console.log ('Value:', value);
    });

    this.database.crear_pedido (formData).subscribe ((pedido: any) => {
      console.log (pedido);
      if (pedido.status === true) {
        this.database.vaciar_carrito ().subscribe ((res: any) => {
          loading.dismiss ();
          console.log (res);
          this.cartService.clear_cart ();
          this.navController.navigateRoot (['gracias-pedido', JSON.stringify (pedido.pedido)]);
        }, error => {
          loading.dismiss ();
          this.cartService.clear_cart ();
          this.navController.navigateRoot (['gracias-pedido', JSON.stringify (pedido.pedido)]);
        });
      }
    }, error => {
      console.log (error);
    });
  }

  async view_datos_bancarios (banco: string) {
    const modal = await this.modalController.create({
      component: DatosBancariosPage,
      componentProps: {
        banco: banco
      },
      swipeToClose: true
    });

    return await modal.present();
  }

  async selectImageSource (fileInput: any) {
    if (Capacitor.isNativePlatform ()) {
      const actionSheet = await this.actionSheetController.create ({
        buttons: [{
          text: 'Tome una foto',
          icon: 'camera',
          handler: () => {
            this.takePicture (CameraSource.Camera);
          }
        }, {
          text: 'Seleccione una foto',
          icon: 'images',
          handler: () => {
            this.takePicture (CameraSource.Photos);
          }
        }]
      });
  
      await actionSheet.present ();
    } else {
      fileInput.click ();
    }
  }

  async takePicture (sourceType: CameraSource) {
    const options: ImageOptions = {
      quality: 90,
      height: 640,
      width: 480,
      preserveAspectRatio: true,
      source: sourceType,
      correctOrientation: true,
      resultType: CameraResultType.Base64
    };

    let image = await Camera.getPhoto (options);

    this.image_file = {
      webPath: 'data:image/jpeg;base64,' + image.base64String,
      blob: this.b64toBlob (image.base64String, `image/${image.format}`),
      name: new Date ().getTime ().toString ()
    };
  }

  b64toBlob (b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
 
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async changeListener (event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files [0];

      this.image_file = {
        webPath: '',
        blob: file,
        name: file.name
      };

      this.getBase64 (file);
    }
  }

  getBase64 (file: any) {
    var reader = new FileReader ();
    reader.readAsDataURL (file);
    
    reader.onload = () => {
      this.image_file.webPath = reader.result;
    };
    
    reader.onerror = (error) => {
      console.log (error);
    };
  }

  back () {
    this.navController.back ();
  }
}
