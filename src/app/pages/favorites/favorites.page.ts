import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../services/database.service';
import { ModalController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { BehaviorSubject } from 'rxjs';
import { SearchPage } from 'src/app/modals/search/search.page';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3,
    spaceBetween: 40,
    centeredSlides: true,
  };

  page: number = 0;
  items: any [] = [];
  categorias: any [] = [];
  loading: boolean = false;

  categoria_selected: string = 'all';
  filtros: any;
  cart_item_count: BehaviorSubject<number>;
  
  constructor (private database: DatabaseService,
    private navController: NavController,
    private cartService: CartService,
    private modalController: ModalController) { }

  ngOnInit () {
    this.cart_item_count = this.cartService.get_cart_item_count ();

    this.loading = true;
    this.database.get_favorites ().subscribe ((res: any) => {
      console.log (res);
      this.items = res.productos_primera_categoria;
      this.categorias = res.categorias;
      this.loading = false;

      if (res.categorias.length > 0) {
        this.categoria_selected = res.categorias [0].id;
      }
    }, error => {
      console.log (error);
      this.loading = false;
    });
  }

  get_data (event: any, join: boolean, type: string) {
    if (type === 'refresher') {
      this.page = 1;
    } else if (type === 'infinite-scroll') {
      this.page = this.page + 1;
    } else {
      this.page = this.page + 1;
    }

    this.database.get_favorites_categorias (this.categoria_selected, this.page).subscribe ((res: any []) => {

      console.log (res);

      if (join) {
        res.forEach ((e: any) => {
          this.items.push (e);
        });
      } else {
        this.items = res;
      }

      if (event === null) {
        this.loading = false;
      } else {
        event.target.complete ();
      }
    }, error => {

    })
  }

  back () {
    this.navController.back ();
  }

  delete_favorite (item: any, event: any) {
    event.stopPropagation ();
    console.log (item);

    item.loading = true;

    const request: any = {
      id_producto: item.id
    };

    this.database.set_favorito (request).subscribe ((res: any) => {
      console.log (res);

      if (res.status === true) {
        this.items = this.items.filter ((obj: any) => {
          return obj.id !== item.id;
        });
      }
    }, error => {
      console.log (error);
    });
  }

  select_category (value: any) {
    this.categoria_selected = value;

    this.page = 0;
    this.items = [];
    this.loading = true;

    this.get_data (null, false, '');
  }

  go_page (page: string) {
    this.navController.navigateForward (page);
  }

  add_carrito (item: any) {
    this.ver_pedido (item);
    // console.log (item);

    // item.add_loading = true;

    // this.database.add_carrito (item.id).subscribe ((res: any) => {
    //   console.log (res);
    //   if (res.status === true) {
    //     item.add_loading = false;
    //     this.cartService.add_product (item);
    //   }
    // }, error => {
    //   console.log (error);
    // });
  }

  ver_pedido (item: any) {
    console.log (item);
    this.navController.navigateForward (['producto-detalle', item.id]);
  }

  async open_search () {
    const modal = await this.modalController.create({
      component: SearchPage,
      swipeToClose: true
    });

    return await modal.present();
  }
}
