import { Injectable } from '@angular/core';
import {
  OneSignal,
  OSNotification,
  OSNotificationOpenedResult,
} from '@ionic-native/onesignal/ngx';
import { NavController, Platform } from '@ionic/angular';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class OnesignalService {
  constructor(
    private auth: AuthService,
    private platform: Platform,
    private database: DatabaseService,
    private onesignal: OneSignal,
    private navController: NavController,
    public toastController: ToastController
  ) {}

  async init_onesignal(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.onesignal.startInit(
        'df490a36-89d2-4cca-a472-71503c49b553',
        '250404781869'
      );
      this.onesignal.inFocusDisplaying(
        this.onesignal.OSInFocusDisplayOption.Notification
      );
  
      this.onesignal
        .handleNotificationReceived()
        .subscribe((response: OSNotification) => {
        });
  
      this.onesignal
        .handleNotificationOpened()
        .subscribe((response: OSNotificationOpenedResult) => {
          if (response.notification.payload.additionalData.destino === 'producto') {
            this.navController.navigateForward([
              'producto-detalle',
              response.notification.payload.additionalData.clave,
            ]);
          }
        });
  
      this.onesignal.getIds().then((identity: any) => {
        this.database.save_onesignal_player_id(identity.userId).subscribe(
          (res: any) => {
            resolve (true);
          },
          (error) => {
            resolve (false);
            console.log(error);
          }
        );
      });
  
      this.onesignal.endInit();
    });
  }
}
