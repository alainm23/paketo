import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SearchPage } from 'src/app/modals/search/search.page';
import { CartService } from 'src/app/services/cart.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.page.html',
  styleUrls: ['./producto-detalle.page.scss'],
})
export class ProductoDetallePage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 40,
    centeredSlides: true,
  };

  id: string;
  producto: any;
  galeria: any [] = [];
  imagen: string = '';
  variante: any;
  cart: Map <number, any> = new Map <number, any> ();
  cart_item_count: BehaviorSubject<number>;
  
  constructor (private cartService: CartService,
    private navController: NavController,
    private database: DatabaseService,
    private route: ActivatedRoute,
    private utils: UtilsService,
    private loadingController: LoadingController,
    private modalController: ModalController) { }

  async ngOnInit () {
    this.id = JSON.parse (this.route.snapshot.paramMap.get ('id'));
    this.cart_item_count = this.cartService.get_cart_item_count ();

    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.database.get_producto_detalle (this.id).subscribe ((res: any) => {
      console.log (res);
      this.producto = res;

      this.imagen = res.imagen;

      this.galeria.push ({
        id: 0,
        imagen: res.imagen,
        orden: 0
      });

      res.galeria.forEach ((element: any) => {
        this.galeria.push (element);
      });

      console.log (this.galeria);

      res.variantes.forEach ((variate: any) => {
        this.cart.set (variate.id, {cantidad: 0, precio: variate.precio_venta});
      });

      if (res.variantes.length > 0) {
        this.variante = res.variantes [0];
      }

      loading.dismiss ();
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  set_variante (item: any) {
    console.log (item);
    this.variante = item;
  }

  go_page (page: string) {
    this.navController.navigateForward (page);
  }

  back () {
    this.navController.back ();
  }

  get_total () {
    let total: number = 0;

    this.cart.forEach ((value: any) => {
      total += value.cantidad * value.precio;
    });

    return total;
  }

  get_total_productos () {
    let total: number = 0;

    this.cart.forEach ((value: any) => {
      total += value.cantidad;
    });

    return total;
  }

  update (value: number, item: any) {
    if (this.cart.has (item.id)) {
      let update = this.cart.get (item.id).cantidad + value;

      if (update < 0) {
        update = 0;
      }

      if (update > item.stock) {
        this.utils.present_toast_confirm ('Stock disponible: ' + item.stock, 'danger');
        update = item.stock;
      }

      this.cart.set (item.id, {cantidad: update, precio: item.precio_venta});
    } else {
      this.cart.set (item.id, {cantidad: 1, precio: item.precio_venta});
    }

    console.log (this.cart);
  }

  valid_change (event: any, item: any) {
    let value: number = parseInt (event.detail.value);

    console.log (value);

    if (value < 0) {
      value = 0;
    }

    if (value > item.stock) {
      this.utils.present_toast_confirm ('Stock disponible: ' + item.stock, 'danger');
      value = item.stock;
    }

    this.cart.set (item.id, {cantidad: value, precio: item.precio_venta});
    console.log (this.cart);
  }

  async submit () {
    let lista: any [] = [];

    this.cart.forEach ((value: any, key: number) => {
      if (value.cantidad > 0) {
        lista.push ({
          id_variante: key,
          cantidad: value.cantidad
        });
      }
    });

    let request: any = {
      lista: lista
    };

    console.log (request);

    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.database.add_carrito_lista (request).subscribe ((res: any) => {
      console.log (res);

      if (res.status === true) {
        this.cartService.get_cloud_cart (true).then (() => {
          this.utils.presen_css_toast ('Agregado correctamente', 'Para editar la cantidad, anda a "Mi Carrito"');
          loading.dismiss ();
        });
      } else {
        loading.dismiss ();
      }
    }, error => {
      console.log (error);
      loading.dismiss ();
    });
  }

  async open_search () {
    const modal = await this.modalController.create({
      component: SearchPage,
      swipeToClose: true
    });

    return await modal.present();
  }
}
