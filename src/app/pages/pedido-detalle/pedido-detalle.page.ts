import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.page.html',
  styleUrls: ['./pedido-detalle.page.scss'],
})
export class PedidoDetallePage implements OnInit {
  loading: boolean = false;
  id: string = '';
  pedido: any = {
    items: []
  };
  cart_item_count: BehaviorSubject<number>;
  constructor (private database: DatabaseService,
    private route: ActivatedRoute,
    private navController: NavController,
    private cartService: CartService,
    private loadingController: LoadingController,
    private utils: UtilsService) { }

  ngOnInit() {
    this.cart_item_count = this.cartService.get_cart_item_count ();

    this.id = this.route.snapshot.paramMap.get ('id');
    console.log (this.id);

    this.loading = true;

    this.database.get_pedido (this.id).subscribe ((res: any) => {
      console.log (res);
      this.pedido = res;
      this.loading = false;
    }, error => {
      this.loading = false;
      console.log (error);
    });
  }

  back () {
    this.navController.back ();
  }

  go_page (page: string) {
    this.navController.navigateForward (page);
  }

  get_total (moneda: string) {
    let total: number = 0;

    this.pedido.items.forEach ((item: any) => {
      if (item.moneda === moneda) {
        total += item.precio * item.cantidad;
      }
    });

    return total;
  }

  go_root (page: string) {
    this.navController.navigateRoot (page);
  }
  
  async voler_pedir () {
    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.database.volver_pedi (this.id).subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();
      
      if (res.status === true) {
        this.cartService.get_cloud_cart ().then (() => {
          this.utils.presen_css_toast ('Agregado correctamente', 'El pedido a sido agregado al carrito nuevamente');
          this.navController.navigateForward (['carrito']);
        });
      }
    }, error => {
      console.log (error);
      loading.dismiss ();
    });
  }

  get_format (date: string, format: string) {
    return moment (date).format (format);
  }

  get_estado (estado: any) {
    let text = '';

    if (estado == 1) {
      text = 'Solicitado';
    } else if (estado == 2) {
      text = 'Cancelado';
    } else if (estado == 3) {
      text = 'Pendiente';
    } else if (estado == 4) {
      text = 'Entregado';
    }

    return text;
  }
}
