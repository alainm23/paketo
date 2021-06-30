import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  items: any [] = [];

  page: number = 0;
  desde: string = moment ().subtract (3, 'months') .format ();
  hasta: string = moment ().format ();
  today: string = moment ().format ('YYYY[-]MM[-]DD');
  loading: boolean = false;

  cart_item_count: BehaviorSubject<number>;

  constructor (private database: DatabaseService,
    private navController: NavController,
    private cartService: CartService) { }

  ngOnInit () {
    this.cart_item_count = this.cartService.get_cart_item_count ();

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

    let request: any = {
      page: this.page,
      desde: moment (this.desde).format ('YYYY[-]MM[-]DD'),
      hasta: moment (this.hasta).format ('YYYY[-]MM[-]DD')
    };

    console.log (request);

    this.database.get_pedidos (request).subscribe ((res: any []) => {
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

  get_format_date (date: string, format: string) {
    return moment (date).format (format);
  }

  filter () {
    this.page = 0;
    this.items = [];
    this.loading = true;
    this.get_data (null, false, '');
  }

  back () {
    this.navController.back ();
  }

  go_page (page: string) {
    this.navController.navigateForward (page);
  }

  detalles (item: any) {
    console.log (item);
    this.navController.navigateForward (['pedido-detalle', item.id]);
  }
}
