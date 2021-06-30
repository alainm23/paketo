import { Injectable } from '@angular/core';

// Services
import { ToastController } from '@ionic/angular';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor (private toastController: ToastController) { }

  async presentToast (message: any, color: string) {
    const toast = await this.toastController.create ({
      message: message,
      color: color,
      duration: 2000,
      position: 'top',
      mode: 'ios',
    });

    toast.present ();
  }

  get_error_message (error: string) {
    
  }

  async presen_css_toast (header: string, message: string) {
    this.toastController.create({
      header: header,
      message: message,
      position: 'top',
      cssClass: 'toast-custom-class',
      mode: 'ios',
      duration: 2500,
    }).then((toast) => {
      toast.present();
    });
  }
}
