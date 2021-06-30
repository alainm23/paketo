import { Component, OnInit } from '@angular/core';

// Services
import { MenuController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CartService } from '../../services/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  ofertas: any [] = [];
  categorias_preferentes: any [] = [];
  categorias: any [] = [];

  loadins: any = {
    ofertas: false,
    categorias_preferentes: false,
    categorias: false
  }

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 10,
  };

  segment: string = 'home';
  cart_item_count: BehaviorSubject<number>;

  constructor (private database: DatabaseService,
    private navController: NavController,
    private utils: UtilsService,
    private cartService: CartService,
    private menuController: MenuController) { }

  async ngOnInit () {
    this.cart_item_count = this.cartService.get_cart_item_count ();
    this.get_data (null);
  }

  get_data (event: any) {
    this.loadins.ofertas = true;
    this.database.get_ultimas_ofertas ().subscribe ((res: any []) => {
      this.loadins.ofertas = false;
      console.log (res);
      this.ofertas = res;

      if (event) {
        this.check_main_loading (event);
      }
    }, error => {
      console.log (error);
      this.loadins.ofertas = false;
      this.check_main_loading (event);
    });

    this.loadins.categorias_preferentes = true;
    this.database.get_categorias_preferentes ().subscribe ((res: any []) => {
      this.loadins.categorias_preferentes = false;
      console.log (res);
      this.categorias_preferentes = res;

      if (event) {
        this.check_main_loading (event);
      }
    }, error => {
      console.log (error);
      this.loadins.categorias_preferentes = false;
      this.check_main_loading (event);
    });
  }

  get_categorias () {
    this.loadins.categorias = true;
    this.database.get_datos ('categorias').subscribe ((res: any) => {
      console.log (res);
      this.loadins.categorias = false;
      this.categorias = res;
    }, error => {
      this.loadins.categorias = false;
      console.log (error);
    });
  }

  check_main_loading (event: any) {
    if (this.loadins.ofertas === false && this.loadins.categorias_preferentes === false) {
      event.target.complete ();
    }
  }

  doRefresh (event: any) {
    if (this.categorias.length <= 0) {
      this.get_categorias ();
    }

    this.get_data (event);
  }

  toggle_view (view: string) {
    if (this.segment === 'home') {
      this.segment = 'categorias';
      if (this.categorias.length <= 0) {
        this.get_categorias ();
      }
    } else {
      this.segment = 'home';
    }
  }

  ver_categoria (item: any) {
    this.navController.navigateForward (['categoria-productos', JSON.stringify (item)]);
  }

  favorite_toggled (item: any) {
    item.tengo_favorito = !item.tengo_favorito;

    const request: any = {
      id_variante: item.id
    };

    // if (item.tengo_favorito) {
    //   this.utils.presen_css_toast ('')
    // }

    this.database.set_favorito (request).subscribe ((res: any) => {
      console.log (res);
      if (res.status !== true) {
        item.tengo_favorito = !item.tengo_favorito;
      }
    }, error => {
      item.tengo_favorito = !item.tengo_favorito;
      console.log (error);
    });
  }

  go_page (page: string) {
    this.navController.navigateForward (page);
  }

  add_carrito (item: any) {
    console.log (item);

    item.loading = true;

    this.database.add_carrito (item.id).subscribe ((res: any) => {
      console.log (res);
      if (res.status === true) {
        item.loading = false;
        this.cartService.add_product (item);
      }
    }, error => {
      console.log (error);
    });
  }

  open_menu () {
    this.menuController.open ();
  }

  search_change (event: any) {
    console.log (event.detail.value);
    this.database.buscar_producto (event.detail.value).subscribe ((res: any) => {
      console.log (res);
    }, error => {
      console.log (error);
    });
  }
}
