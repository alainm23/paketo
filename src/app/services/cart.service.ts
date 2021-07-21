import { Injectable } from '@angular/core';

// Services
import { DatabaseService } from '../services/database.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart = [];
  private cart_item_count = new BehaviorSubject (0);
  private categoria_subject = new Subject<boolean> ();

  constructor (private database: DatabaseService,
    private utils: UtilsService) {

  }

  categoria_changed (data: any) {
    this.categoria_subject.next (data);
  }

  get_categoria_observable (): Subject<any> {
    return this.categoria_subject;
  }

  async get_cloud_cart (reset: boolean=false): Promise<boolean> {
    if (reset === true) {
      this.cart = [];
    }

    return await new Promise ((resolve, reject) => {
      this.database.get_carrito ().toPromise ().then ((res: any) => {
        console.log (res);
        res.items.forEach ((producto: any) => {
          this.cart.push (producto);
          this.cart_item_count.next (this.cart.length);
        });
        resolve (true);
      }, error => {
        resolve (false);
      });
    });
  }

  get_cart () {
    return this.cart;
  }

  get_cart_item_count () {
    return this.cart_item_count;
  }

  add_product (product: any, notify: boolean = true) {
    if (product.cantidad === null || product.cantidad === undefined) {
      product.cantidad = 0;
    }

    let added = false;
    for (let p of this.cart) {
      if (p.id === product.id) {
        p.cantidad += 1;
        added = true;

        if (notify) {
          this.utils.presen_css_toast ('Agregado correctamente', 'Para editar la cantidad, anda a "Mi Carrito"');
        }

        break;
      }
    }
    if (!added) {
      product.cantidad = 1;
      this.cart.push (product);
      this.cart_item_count.next (this.cart.length);
      if (notify) {
        this.utils.presen_css_toast ('Agregado correctamente', 'Para editar la cantidad, anda a "Mi Carrito"');
      }
    }
  }

  decrease_product (product: any) {
    for (let [index, p] of this.cart.entries ()) {
      if (p.id === product.id) {
        p.cantidad -= 1;
        if (p.cantidad <= 0) {
          this.cart.splice (index, 1);
          this.cart_item_count.next (this.cart.length);
        }
      }
    }
  }

  remove_product (product: any) {
    for (let [index, p] of this.cart.entries ()) {
      if (p.id === product.id) {
        this.cart.splice (index, 1);
        this.cart_item_count.next (this.cart.length);
      }
    }
  }

  clear_cart () {
    this.cart = [];
    this.cart_item_count.next (this.cart.length);
  }
}
