import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// Services
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../services/auth.service';
import { NavController, MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (
    private storage: Storage,
    private auth: AuthService,
    private navController: NavController,
    public menuController: MenuController) {}
  canActivate () {
    return this.storage.get ('PAKETO_USER_ACCESS').then (async (user: any) => {
      if (user !== null) {
        this.auth.USER_ACCESS = JSON.parse (user);
        this.auth.USER_DATA = JSON.parse (await this.storage.get ('PAKETO_USER_DATA'));
        this.menuController.enable (true, 'menu');
        return true;
      } else {
        this.menuController.enable (false, 'menu');
        this.navController.navigateRoot ('onboarding');
        return false;
      }
    });
  }
}