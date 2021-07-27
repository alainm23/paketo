import { Component, OnInit } from '@angular/core';

// Services
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CartService } from '../../services/cart.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SearchPage } from '../../modals/search/search.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  ofertas: any [] = [];
  categorias_preferentes: any [] = [];
  categorias: any [] = [];
  search_result: any = {
    categorias: [],
    productos: []
  };
  promociones: any;

  loadins: any = {
    ofertas: false,
    categorias_preferentes: false,
    categorias: false,
    promociones: false,
    search: false
  }

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 2,
    spaceBetween: 15,
  };

  slideOptscard = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
  };

  segment: string = 'home';
  search_text: string = '';
  cart_item_count: BehaviorSubject<number>;

  constructor (private database: DatabaseService,
    private navController: NavController,
    private utils: UtilsService,
    private cartService: CartService,
    private menuController: MenuController,
    private auth: AuthService,
    private modalController: ModalController) { }

  async ngOnInit () {
    this.cartService.get_categoria_observable ().subscribe ((res: any) => {
      this.toggle_view ();
    });

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

    this.loadins.promociones = true;
    this.database.get_promociones ().subscribe ((res: any []) => {
      this.loadins.promociones = false;
      console.log (res);

      this.promociones = res;

      if (event) {
        this.check_main_loading (event);
      }
    }, error => {
      console.log (error);
      this.loadins.promociones = false;
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
    if (this.loadins.ofertas === false && this.loadins.categorias_preferentes === false
        && this.loadins.promociones === false) {
      event.target.complete ();
    }
  }

  doRefresh (event: any) {
    if (this.categorias.length <= 0) {
      this.get_categorias ();
    }

    this.get_data (event);
  }

  toggle_view () {
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

  favorite_toggled (item: any, event: any) {
    event.stopPropagation ();
    item.tengo_favorito = !item.tengo_favorito;
    
    const request: any = {
      id_producto: item.id
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
    console.log (page)
    this.navController.navigateForward (page).then ((res) => {
      console.log (res);
    }).catch ((error: any) => {
      console.log (error);
    });
  }

  add_carrito (item: any, event=null) {
    if (event !== null) {
      event.stopPropagation ();
    }

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
    this.search_result.categorias = [];
    this.search_result.productos = [];

    console.log (event.detail.value);

    if (this.search_text.trim () !== '') {
      this.loadins.search = true;
      this.database.buscar_producto (event.detail.value).subscribe ((res: any) => {
        this.search_result = res;
        console.log (res);
        this.loadins.search = false;
      }, error => {
        this.loadins.search = false;
        console.log (error);
      });
    }
  }

  close_search () {
    this.search_result.categorias = [];
    this.search_result.productos = [];
    this.search_text = '';
  }

  get_search_visible () {
    return (this.search_result.categorias.length + this.search_result.productos.length) > 0;
  }

  ver_pedido (item: any) {
    console.log (item);
    this.navController.navigateForward (['producto-detalle', item.id]);
  }

  _ver_pedido (id: string) {
    this.navController.navigateForward (['producto-detalle', id]);
  }

  share_wp () {
    window.open ('https://wa.me/51996280066', '_system', 'location=yes');
  }

  agregar_promociones (item: any) {
    item.loading = true;
    console.log (item);
    this.database.add_carrito (item.id).subscribe ((res: any) => {
      console.log (res);
      if (res.status === true) {
        item.loading = false;
        this.cartService.add_product (item);
      }
    }, error => {
      item.loading = false;
      console.log (error);
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
