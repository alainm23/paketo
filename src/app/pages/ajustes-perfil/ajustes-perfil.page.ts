import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-ajustes-perfil',
  templateUrl: './ajustes-perfil.page.html',
  styleUrls: ['./ajustes-perfil.page.scss'],
})
export class AjustesPerfilPage implements OnInit {
  cart_item_count: BehaviorSubject<number>;
  notificaciones: boolean = true;
  constructor (private navController: NavController,
    private cartService: CartService) { }

    ngOnInit () {
      this.cart_item_count = this.cartService.get_cart_item_count ();
    }
  
    back () {
      this.navController.back ();
    }
  
    go_page (page: string) {
      this.navController.navigateForward ([page]);
    }

    editar_categloria () {
      this.navController.navigateForward (['categorias-interes', 'black']);
    }
}
