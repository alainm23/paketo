import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from 'src/app/services/database.service';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  cart: any[] = [];
  cart_item_count: BehaviorSubject<number>;

  compra_minima_dolares: number;
  compra_minima_soles: number;

  constructor(
    private database: DatabaseService,
    private navController: NavController,
    public cartService: CartService,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.cart_item_count = this.cartService.get_cart_item_count();
    this.cart = this.cartService.get_cart();
  }

  back() {
    this.navController.back();
  }

  delete_item(item: any) {
    console.log(item);
    item.loading = true;
    this.database.quitar_carrito(item.id).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status === true) {
          this.cartService.remove_product(item);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  update_cantidad(action: string, item: any) {
    const request: any = {
      id_variante: item.id,
      action: action,
    };

    console.log(request);

    this.database.sumar_restar_carrito(request).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status === true) {
          if (action === 'sumar') {
            this.cartService.add_product(item, false);
          } else {
            this.cartService.decrease_product(item);
          }
        }
      },
      (error) => {
        this.utils.presentToast(error.error.message, 'danger');
        console.log(error);
      }
    );
  }

  get_total(moneda: string) {
    let total: number = 0;

    this.cart.forEach((item: any) => {
      if (item.moneda === moneda) {
        total += item.precio * item.cantidad;
      }
    });

    return total;
  }

  validar_cantidades() {
    let returned: boolean = true;

    this.cart.forEach((item: any) => {
      if (item.cantidad <= 0) {
        returned = false;
      }
    });

    return returned;
  }

  submit() {
    if (!this.validar_cantidades()) {
      this.utils.presentToast(
        'Ingrese un producto con una cantidad valida',
        'danger'
      );
      return;
    }
    
    if (this.valid_alerta ()) {
      this.utils.presentToast(
        'Su pedido no supera el monto minimo',
        'danger'
      );
      return;
    }

    this.navController.navigateForward(['checkout']);
  }

  valid_change(event: any, item: any) {
    console.log(event);
    console.log(item);

    if (event <= 0) {
      this.utils.presentToast(
        'Ingrese un producto con una cantidad valida',
        'danger'
      );
      setTimeout(() => {
        item.cantidad = 1;
      }, 250);
      return;
    }

    let action: string = '';
    if (event > item.cantidad) {
      action = 'sumar';
    } else if (event < item.cantidad) {
      action = 'restar';
    } else {
      action = '';
      return;
    }

    const request: any = {
      id_variante: item.id,
      action: action,
      cantidad: event,
      replace: true,
    };

    console.log(request);

    this.database.sumar_restar_carrito(request).subscribe(
      (res: any) => {
        console.log(res);
      },
      (error) => {
        item.cantidad = item.cantidad_disponible;
        console.log(error);
        this.utils.present_toast_confirm(error.error.message, 'danger');
      }
    );
  }

  doRefresh(event: any) {
    this.cartService.get_cloud_cart().then(() => {
      event.target.complete();
    });
  }

  go_page(page: string) {
    this.navController.navigateForward(page);
  }

  valid_alerta() {
    let returned: boolean = false;

    this.compra_minima_dolares = this.cartService.compra_minima_dolares;
    this.compra_minima_soles = this.cartService.compra_minima_soles;
    let dolares = this.get_total('USD');
    let soles = this.get_total('S/.');

    if (dolares <= 0) {
      this.compra_minima_dolares = 0;
    }

    if (soles <= 0) {
      this.compra_minima_soles = 0;
    }

    if (
      this.compra_minima_dolares > dolares ||
      this.compra_minima_soles > soles
    ) {
      returned = true;
    }

    return returned;
  }
}
