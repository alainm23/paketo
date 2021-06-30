import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-categoria-productos',
  templateUrl: './categoria-productos.page.html',
  styleUrls: ['./categoria-productos.page.scss'],
})
export class CategoriaProductosPage implements OnInit {
  item: any;

  items: any [] = [];
  filtros: any [] = [];
  loading: boolean = false;

  show_filter: boolean = false;
  page: number = 0;

  filter_map: Map <number, boolean> = new Map <number, boolean> ();
  cart_item_count: BehaviorSubject<number>;
  constructor (private route: ActivatedRoute,
    private navController: NavController,
    private database: DatabaseService,
    private cartService: CartService) { }

  ngOnInit () {
    this.cart_item_count = this.cartService.get_cart_item_count ();
    this.item = JSON.parse (this.route.snapshot.paramMap.get ('data'));
    console.log (this.item);
    this.loading = true;
    this.get_data (null, false, '');
  }

  get_data (event: any, join: boolean, type: string) {
    if (type === 'refresher') {
      this.page = 1;
    } else if (type === 'infinite-scroll') {
      this.page = this.page + 1;
    } else {
      this.page = this.page + 1;
    }

    this.database.get_productos_categoria (this.get_filter_data ()).subscribe ((res: any) => {
      console.log (res);

      if (res.filtros) {
        this.filtros = res.filtros;
      }

      if (join) {
        if (res.filtros) {
          res.productos.forEach ((e: any) => {
            this.items.push (e);
          });
        } else {
          res.forEach ((e: any) => {
            this.items.push (e);
          });
        }
      } else {
        if (res.filtros) {
          this.items = res.productos;
        } else {
          this.items = res;
        }
      }

      if (event === null) {
        this.loading = false;
      } else {
        event.target.complete ();
      }
    }, error => {
      if (event === null) {
        this.loading = false;
      } else {
        event.target.complete ();
      }
      console.log (error);
    });
  } 

  get_filter_data () {
    let request: any = {
      page: this.page,
      id_categoria: this.item.id,
      filtros: []
    };

    this.filter_map.forEach((value: boolean, key: number) => {
      if (value) {
        request.filtros.push (key);
      }
    });

    console.log (request);

    return request;
  }

  filter_toogled () {
    this.show_filter = !this.show_filter;
  }

  back () {
    this.navController.back ();
  }

  filter (event: any, item: any) {
    this.filter_map.set (item.id, event.detail.checked);
    this.items = [];
    this.page = 0;
    this.loading = true;
    this.get_data (null, false, '');
  }

  go_page (page: string) {
    this.navController.navigateForward (page);
  }

  go_root (page: string) {
    this.navController.navigateRoot (page);
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
}
